// src/lib/sync/protocol.ts

import { db, SyncableEntity, StudentProgress, Note, QuizAttempt, OfflineSyncState } from './db';
import { encryptData, decryptData, deriveEncryptionKey } from './crypto';
import { Table } from 'dexie';

// --- Configuration and Types ---

// Define the shape of all syncable models for iteration and type safety
type SyncableModel = StudentProgress | Note | QuizAttempt;
type SyncableTable = Table<SyncableModel>;

// Helper array to iterate over syncable stores and identify their encrypted fields
const SYNCABLE_STORES: Array<{ name: keyof typeof db; table: SyncableTable; encryptedFields: string[] }> = [
    { name: 'studentProgress' as const, table: db.studentProgress as SyncableTable, encryptedFields: ['progressData'] },
    { name: 'notes' as const, table: db.notes as SyncableTable, encryptedFields: ['content'] },
    { name: 'quizAttempts' as const, table: db.quizAttempts as SyncableTable, encryptedFields: ['attemptData'] },
];

const GLOBAL_SYNC_STATE_KEY = 'global';

// Interface for the data sent to /api/sync
export interface SyncRequestPayload {
    lastSyncTimestamp: string; // ISO 8601 string
    mutations: Array<{
        table: string;
        records: SyncableModel[];
    }>;
}

// Interface for the data received from /api/sync
export interface SyncResponsePayload {
    success: boolean;
    serverTimestamp: string; // New last sync timestamp (ISO 8601)
    deltas: Array<{
        table: string;
        records: SyncableModel[];
    }>;
}

/**
 * Retrieves the last successful sync timestamp from the local offlineSyncs store.
 * @returns The last successful sync Date object, or null if never synced.
 */
async function getLastSyncTimestamp(): Promise<Date | null> {
    const state = await db.offlineSyncs.where('entityName').equals(GLOBAL_SYNC_STATE_KEY).first();
    if (state?.lastSuccessfulSync) {
        // Ensure we are working with a Date object
        return new Date(state.lastSuccessfulSync);
    }
    // Default to epoch time if no previous sync exists
    return new Date(0); 
}

/**
 * Updates the last successful sync timestamp in the local offlineSyncs store.
 * @param timestamp The new timestamp (Date or ISO string).
 */
async function updateLastSyncTimestamp(timestamp: Date | string): Promise<void> {
    const syncDate = new Date(timestamp);
    await db.offlineSyncs.put({
        id: 1, // Assuming only one global sync state record
        entityName: GLOBAL_SYNC_STATE_KEY,
        lastSuccessfulSync: syncDate,
    });
}

/**
 * CORE FUNCTION: Executes the 2-Tier Delta Synchronization protocol (PUSH and PULL).
 * 
 * @param sessionToken The user's NextAuth session token for key derivation.
 * @param userId The user's ID, used as salt for key derivation.
 */
export async function syncData(sessionToken: string, userId: string): Promise<boolean> {
    console.log('Starting sync process...');

    try {
        // 1. Setup - Derive Encryption Key
        const encryptionKey = await deriveEncryptionKey(sessionToken, userId);
        const lastSyncDate = await getLastSyncTimestamp();
        const lastSyncTimestamp = lastSyncDate ? lastSyncDate.toISOString() : new Date(0).toISOString();
        
        console.log(`Last successful sync: ${lastSyncTimestamp}`);

        // --- PUSH Phase ---

        const mutations: SyncRequestPayload['mutations'] = [];
        
        // Find and encrypt dirty records
        for (const store of SYNCABLE_STORES) {
            // Find records where clientUpdatedAt is strictly greater than the last successful sync timestamp
            const dirtyRecords = await store.table
                .where('clientUpdatedAt')
                .above(lastSyncDate as Date) // Use Dexie's above() on the Date object
                .toArray();

            if (dirtyRecords.length > 0) {
                console.log(`Found ${dirtyRecords.length} dirty records in ${store.name}`);
                
                const encryptedRecords = await Promise.all(dirtyRecords.map(async (record) => {
                    const encryptedRecord: any = { ...record };
                    // Encrypt sensitive fields
                    for (const field of store.encryptedFields) {
                        const sensitiveData = (record as any)[field];
                        if (sensitiveData) {
                            encryptedRecord[field] = await encryptData(encryptionKey, sensitiveData);
                        }
                    }
                    // Remove IndexedDB-specific primary key for server transport
                    delete encryptedRecord.id; 
                    return encryptedRecord;
                }));

                mutations.push({
                    table: store.name,
                    records: encryptedRecords,
                });
            }
        }
        
        const payload: SyncRequestPayload = {
            lastSyncTimestamp,
            mutations,
        };

        // Network Request Stub (POST to /api/sync)
        const response = await fetch('/api/sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Authorization header might be added here, depending on NextAuth setup
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Sync API failed with status: ${response.status}`);
        }

        const syncResponse: SyncResponsePayload = await response.json();

        if (!syncResponse.success) {
            throw new Error('Sync API returned an unsuccessful status.');
        }

        const serverTimestamp = syncResponse.serverTimestamp;

        // --- PULL Phase ---
        
        await db.transaction('rw', db.studentProgress, db.notes, db.quizAttempts, db.offlineSyncs, async (tx) => {
            console.log('Starting PULL transaction...');
            
            // 2. Process Deltas from Server
            for (const delta of syncResponse.deltas) {
                const storeMeta = SYNCABLE_STORES.find(s => s.name === delta.table);
                if (!storeMeta) {
                    console.warn(`Received delta for unknown table: ${delta.table}`);
                    continue;
                }

                const { table, encryptedFields } = storeMeta;
                const dbTable = storeMeta.table; // Use the pre-typed table reference
                
                console.log(`Processing ${delta.records.length} deltas for ${table}`);

                for (const serverRecord of delta.records) {
                    const localRecord = await dbTable.where('clientId').equals(serverRecord.clientId).first();
                    
                    // LWW Conflict Resolution is implicitly handled here:
                    // 1. If local record exists, we compare timestamps.
                    // 2. The server already performed LWW during PUSH. If the server is sending us a record, 
                    //    it means this record is *newer* than the timestamp we sent (lastSyncTimestamp).
                    //    The architecture specifies: "The client's stale record will be overwritten by the server's correct (newer) version during the PULL phase."
                    
                    let finalRecord: any = { ...serverRecord };
                    
                    // Decrypt sensitive fields for storage
                    for (const field of encryptedFields) {
                        const encryptedValue = (serverRecord as any)[field];
                        if (encryptedValue) {
                            finalRecord[field] = await decryptData(encryptionKey, encryptedValue);
                        }
                    }

                    if (localRecord) {
                        // Update existing record, preserving the IndexedDB primary key if present
                        finalRecord.id = localRecord.id; 
                        
                        // We strictly overwrite the local record with the decrypted server version, 
                        // as the server has already applied LWW if a conflict occurred during PUSH.
                        await dbTable.put(finalRecord);
                    } else {
                        // Insert new record (since it originated from the server)
                        await dbTable.add(finalRecord);
                    }
                }
            }

            // 3. Update Sync Timestamp (Crucial step after successful PUSH/PULL)
            await updateLastSyncTimestamp(serverTimestamp);
            console.log(`Sync complete. New last successful sync: ${serverTimestamp}`);
        });

        return true;

    } catch (error) {
        console.error('Synchronization failed:', error);
        // Note: Error handling (e.g., notifying the user, retries) would be implemented in useSyncStore.ts
        return false;
    }
}

/**
 * Placeholder function for client-side session token retrieval.
 * Implement real logic to read from cookies or NextAuth client-side helpers.
 */
export async function getCurrentSessionToken(): Promise<string | null> {
    // WARNING: This is a placeholder. Real implementation needed.
    // Example: Reading from a secure cookie or local storage if token is safe to store there.
    // Since NextAuth manages this, it's often best to read from the NextAuth client session.
    // For demonstration, we use a mock token.
    return 'mock-session-token-for-data-access-demo';
}

/**
 * Placeholder function for client-side user ID retrieval.
 * Implement real logic to read from cookies or NextAuth client-side helpers.
 */
export async function getCurrentUserId(): Promise<string | null> {
    // WARNING: This is a placeholder. Real implementation needed.
    // For demonstration, we use a mock user ID.
    return 'demo-user-12345';
}