// src/lib/sync/sync-server-handler.ts
import { PrismaClient } from '@prisma/client';
import { deriveEncryptionKeyServer, decryptDataServer, encryptDataServer } from './crypto-server';
import { SyncRequestPayload, SyncResponsePayload } from './protocol'; // We need to ensure these types are exportable/usable from server

// Initialize Prisma client (assuming standard setup)
const prisma = new PrismaClient();

// Define server-side syncable tables and their encrypted fields
// This mapping must align with the client-side SYNCABLE_STORES definition in protocol.ts
const SERVER_SYNCABLE_ENTITIES = [
    { name: 'studentProgress' as const, prismaModel: prisma.studentProgress, encryptedFields: ['progressData'] },
    { name: 'notes' as const, prismaModel: prisma.note, encryptedFields: ['content'] },
    { name: 'quizAttempts' as const, prismaModel: prisma.quizAttempt, encryptedFields: ['attemptData'] },
];

/**
 * Handles the unified PUSH/PULL delta synchronization for the server API.
 * 
 * @param payload The SyncRequestPayload sent by the client.
 * @param sessionToken The user's session token for key derivation.
 * @param userId The user's ID.
 * @returns A SyncResponsePayload.
 */
export async function handleSync(
    payload: SyncRequestPayload, 
    sessionToken: string, 
    userId: string
): Promise<SyncResponsePayload> {
    const serverTimestamp = new Date().toISOString();
    const encryptionKey = deriveEncryptionKeyServer(sessionToken, userId);
    
    // Convert client's last sync timestamp string to Date for Prisma queries
    const lastSyncDate = new Date(payload.lastSyncTimestamp);
    
    // --- 1. PUSH Phase: Process Incoming Mutations ---
    
    await prisma.$transaction(async (tx) => {
        for (const mutationGroup of payload.mutations) {
            const entityMeta = SERVER_SYNCABLE_ENTITIES.find(e => e.name === mutationGroup.table);
            if (!entityMeta) {
                console.warn(`Server received mutation for unknown table: ${mutationGroup.table}`);
                continue;
            }

            const model = entityMeta.prismaModel as any; // Cast to 'any' for dynamic access
            
            for (const record of mutationGroup.records) {
                // Decrypt sensitive fields
                const decryptedRecord: any = { ...record };
                for (const field of entityMeta.encryptedFields) {
                    const encryptedValue = (record as any)[field];
                    if (encryptedValue) {
                        try {
                             decryptedRecord[field] = decryptDataServer(encryptionKey, encryptedValue);
                        } catch (e) {
                            console.error(`Decryption failed for record in ${entityMeta.name}:`, e);
                            // Skip record if decryption fails (potential tamper or key mismatch)
                            continue; 
                        }
                    }
                }
                
                // Ensure clientUpdatedAt is a Date object
                decryptedRecord.clientUpdatedAt = new Date(decryptedRecord.clientUpdatedAt);

                // Server-side LWW Conflict Resolution: 
                // We check if the server record exists and if the client's version is newer
                
                const existingServerRecord = await model.findUnique({
                    where: { clientId: decryptedRecord.clientId },
                    select: { clientUpdatedAt: true, id: true, isDeleted: true }, // Need the server ID and timestamp
                });

                if (existingServerRecord) {
                    // Update: Only proceed if client's timestamp is greater than or equal to server's
                    if (decryptedRecord.clientUpdatedAt >= existingServerRecord.clientUpdatedAt) {
                        
                        // We use the existing server ID for the update operation
                        const serverId = existingServerRecord.id;
                        
                        // Clean up the object for Prisma update operation
                        delete decryptedRecord.id; // Remove client-side IndexedDB PK
                        
                        await model.update({
                            where: { id: serverId },
                            data: {
                                ...decryptedRecord,
                                // Server updates its own timestamp to ensure the PULL delta includes the record
                                // and the LWW logic on the client is satisfied.
                                clientUpdatedAt: new Date(), 
                            },
                        });
                    }
                    // Else: Server record is newer, ignore client PUSH (LWW)
                } else {
                    // Create: Only if the record is not marked for deletion immediately
                    if (!decryptedRecord.isDeleted) {
                         // Clean up the object for Prisma create operation
                         delete decryptedRecord.id; // Remove client-side IndexedDB PK
                         
                         await model.create({
                             data: {
                                 ...decryptedRecord,
                                 clientUpdatedAt: new Date(),
                             },
                         });
                    }
                }
            }
        }
    }, {
        // Use a sufficient timeout for large sync transactions
        timeout: 20000 // 20 seconds
    });
    
    // --- 2. PULL Phase: Generate Server Deltas ---
    
    const deltas: SyncResponsePayload['deltas'] = [];
    
    for (const entityMeta of SERVER_SYNCABLE_ENTITIES) {
        const model = entityMeta.prismaModel as any;
        
        // Find all records updated or created on the server *after* the client's last successful sync
        const serverDeltas = await model.findMany({
            where: {
                clientUpdatedAt: {
                    gt: lastSyncDate,
                },
            },
            // We need all fields including the server-generated id (implicitly available in findMany result)
            // and the clientId
        });

        if (serverDeltas.length > 0) {
            const encryptedDeltas = serverDeltas.map((record: any) => {
                const encryptedRecord = { ...record };
                
                // Re-Encrypt sensitive fields for PULL transport
                for (const field of entityMeta.encryptedFields) {
                    const sensitiveData = record[field];
                    if (sensitiveData) {
                        encryptedRecord[field] = encryptDataServer(encryptionKey, sensitiveData);
                    }
                }
                // Ensure client can use this record without needing its IndexedDB PK
                delete encryptedRecord.id; 
                return encryptedRecord;
            });
            
            deltas.push({
                table: entityMeta.name,
                records: encryptedDeltas,
            });
        }
    }

    return {
        success: true,
        serverTimestamp,
        deltas,
    };
}