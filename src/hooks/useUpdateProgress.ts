"use client";
// src/hooks/useUpdateProgress.ts

import { useSyncStore } from '@/stores/useSyncStore';
import { db, StudentProgress } from '@/lib/sync/db';
import { useState, useCallback } from 'react';

// Define the shape of the update payload (simplified for demonstration)
interface ProgressUpdatePayload {
    clientId: string;
    newProgressData: string; // The updated, unencrypted data
}

/**
 * Hook to update a StudentProgress record locally in Dexie.
 * This sets clientUpdatedAt to trigger the synchronization worker.
 */
export function useUpdateProgress() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const setSyncStatus = useSyncStore((state) => state.startSync);

    const updateProgress = useCallback(async (payload: ProgressUpdatePayload) => {
        setIsLoading(true);
        setError(null);
        
        try {
            // 1. Retrieve the existing record by its unique clientId
            const existingRecord = await db.studentProgress.where('clientId').equals(payload.clientId).first();
            
            if (!existingRecord) {
                // If this is a new record, we'd generate a new clientId and insert it.
                // For this demo, we assume we are updating an existing record (either server-synced or client-created).
                throw new Error(`StudentProgress record with clientId ${payload.clientId} not found locally.`);
            }

            // 2. Prepare the mutation payload
            const now = new Date();
            const updateData: Partial<StudentProgress> = {
                progressData: payload.newProgressData,
                clientUpdatedAt: now, // CRITICAL: This timestamp triggers the sync worker
            };
            
            // 3. Perform the local Dexie update
            // We use .update(id, changes) based on the IndexedDB primary key (id)
            await db.studentProgress.update(existingRecord.id!, updateData);
            
            console.log(`[useUpdateProgress] Updated local progress record ${payload.clientId}. clientUpdatedAt set to ${now.toISOString()}`);

            // 4. Trigger the synchronization attempt via the store action
            // Note: In a real app, sessionToken and userId need to be retrieved here. 
            // We rely on the mock implementation in protocol.ts for this demo.
            const mockSessionToken = 'mock-session-token-for-data-access-demo'; // Must match protocol.ts mock
            const mockUserId = 'demo-user-12345'; // Must match protocol.ts mock
            
            setSyncStatus(mockSessionToken, mockUserId);
            
            // The sync worker will pick up the change because clientUpdatedAt > lastSuccessfulSync

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during local mutation.';
            console.error('[useUpdateProgress] Mutation failed:', err);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [setSyncStatus]);

    return { updateProgress, isLoading, error };
}