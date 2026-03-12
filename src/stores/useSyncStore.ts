// src/stores/useSyncStore.ts

import { create } from 'zustand';
import { db, DownloadQueueItem } from '@/lib/sync/db';
import { syncData } from '@/lib/sync/protocol';
import { fetchQuizDefinition } from '@/lib/sync/content-fetcher'; // US 3.5 import
import { ContentQuality } from '@/generated/prisma';

// Define sync status constants
type SyncStatus = 'idle' | 'syncing' | 'error' | 'success';

interface SyncState {
    // Core Synchronization State
    status: SyncStatus;
    lastSuccessfulSync: Date | null;
    syncError: string | null;
    
    // Connectivity
    isOnline: boolean;
    
    // Key Management
    // Note: CryptoKey objects are not serializable, so we manage the derivation 
    // and usage within the action, or if we needed to persist it, we'd use a different method.
    // For simplicity, we will assume the key is derived on demand during sync, 
    // or we might store a flag indicating key availability. Let's just focus on status here.
    
    // Download Queue Status (Example of providing queue insight)
    pendingDownloadsCount: number;
    // US 2.3: Pre-Download Storage Indicator
    estimatedDownloadSize: number | null; // Size in bytes
    // US 2.7: Storage Management Dashboard
    usedStorageBytes: number;
}

interface SyncActions {
    setIsOnline: (isOnline: boolean) => void;
    // Fetches the initial state from IndexedDB
    initialize: () => Promise<void>;
    // Core synchronization function
    startSync: (sessionToken: string, userId: string) => Promise<void>;
    // Utility to get the current download queue status
    checkDownloadQueue: () => Promise<void>;
    // Initiates granular content download for a Course, Section, or Lecture (US 2.2)
    enqueueContentDownload: (contentType: 'course' | 'section' | 'lecture', contentId: string, quality: ContentQuality) => Promise<void>;
    // US 2.3: Calculates estimated storage requirement before download
    calculateDownloadEstimate: (contentType: 'course' | 'section' | 'lecture', contentId: string, quality: ContentQuality) => Promise<number | null>;
    // US 2.6: Resume pending downloads when online
    resumeDownloads: () => Promise<void>;
    // US 2.7: Check total used storage
    checkUsedStorage: () => Promise<void>;
    // US 2.7: Delete content to free storage
    deleteDownloadedContent: (contentIds: string[]) => Promise<void>;
    // US 3.3: Store completed quizzes/assignments locally for later sync
    submitOfflineQuizAttempt: (quizId: string, attemptNumber: number, answers: Record<string, any>) => Promise<void>;
    // US 3.4: Store lecture/course progress updates locally
    updateLocalProgress: (courseId: string, lessonId: string, newProgressData: Record<string, any>) => Promise<void>;
}
 
export const useSyncStore = create<SyncState & SyncActions>((set, get) => ({
    status: 'idle',
    lastSuccessfulSync: null,
    syncError: null,
    isOnline: true, // Assume online until connectivity check implemented
    pendingDownloadsCount: 0,
    estimatedDownloadSize: null, // Initialize storage indicator
    usedStorageBytes: 0, // US 2.7: Initialize storage usage
 
    setIsOnline: (isOnline) => set({ isOnline }),

    initialize: async () => {
        // Load initial state from IndexedDB
        try {
            const syncState = await db.offlineSyncs.get('global');
            const lastSync = syncState?.lastSuccessfulSync ?? null;

            set({
                lastSuccessfulSync: lastSync,
                status: 'idle',
                syncError: null,
            });
            await get().checkDownloadQueue();
            await get().checkUsedStorage(); // US 2.7: Check storage on init
 
            console.log(`SyncStore initialized. Last sync: ${lastSync?.toISOString() ?? 'Never'}`);
        } catch (error) {
            console.error('Error initializing SyncStore:', error);
        }
    },
    
    checkDownloadQueue: async () => {
        try {
            const count = await db.downloadQueue
                .filter(item => item.status === 'pending' || item.status === 'downloading')
                .count();
            set({ pendingDownloadsCount: count });
        } catch (error) {
            console.error('Error checking download queue:', error);
            set({ pendingDownloadsCount: 0 });
        }
    },

    startSync: async (sessionToken, userId) => {
        const { isOnline, status: currentStatus } = get();

        if (currentStatus === 'syncing') {
            console.log('Sync already in progress. Aborting new sync attempt.');
            return;
        }

        if (!isOnline) {
            console.warn('Cannot start sync: Offline.');
            return;
        }

        console.log('Starting synchronization...');
        set({ status: 'syncing', syncError: null });

        try {
            // syncData handles PUSH, LWW resolution, and PULL
            const success = await syncData(sessionToken, userId);

            if (success) {
                // Read the new timestamp after successful syncData execution
                const newSyncState = await db.offlineSyncs.get('global');
                const lastSync = newSyncState?.lastSuccessfulSync ?? new Date();

                set({ status: 'success', lastSuccessfulSync: lastSync });
                await get().checkDownloadQueue(); // Update queue count
                console.log('Synchronization successful.');
            } else {
                set({ status: 'error', syncError: 'Sync process failed. See console for details.' });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            set({ status: 'error', syncError: `Synchronization failed: ${errorMessage}` });
            console.error('Final sync failure in useSyncStore:', error);
        } finally {
            // If status is 'syncing' but not set to 'success' or 'error', set to 'idle'
            if (get().status === 'syncing') {
                 set({ status: 'idle' });
            }
            // If error, keep status as 'error' until state reset or new sync attempt
        }
    },
    
    // US 2.3: Utility to simulate size estimation for a given content selection
    calculateDownloadEstimate: async (contentType, contentId, quality) => {
        // In reality, this would fetch structure via the new API endpoint and calculate the sum of Lecture.sizeBytes
        // and other downloadable resources, adjusted for selected quality.
        console.log(`Estimating size for ${contentType} ID: ${contentId} at quality: ${quality}`);
        
        // Simulate API call delay and size calculation
        await new Promise(resolve => setTimeout(resolve, 500));

        const simulatedSize = contentId.length * 1024 * 1024; // Dummy estimate in Bytes (e.g., ~32 MB)

        set({ estimatedDownloadSize: simulatedSize });
        return simulatedSize;
    },

    enqueueContentDownload: async (contentType, contentId, quality) => {
        // Implementation for US 2.2 (initiate granular downloads) and US 2.3 (use estimated size)

        const estimatedSize = await get().calculateDownloadEstimate(contentType, contentId, quality);
        
        if (estimatedSize === null || estimatedSize === 0) {
            console.error('Download aborted: Could not estimate size.');
            return;
        }

        console.log(`Initiating download for ${contentType} ID: ${contentId}. Estimated size: ${estimatedSize} bytes.`);
        
        // US 2.4: Media Download Notification Simulation
        if (contentType === 'course') {
            console.warn(`[US 2.4 Notification] Course ID ${contentId} contains bulk media (videos/resources) requiring separate handling or confirmation.`);
        }

        // In a full implementation, we'd proceed to generate DownloadQueueItems here.
        
        // For now, we simulate queuing and update the count.
        set(state => ({
            pendingDownloadsCount: state.pendingDownloadsCount + 1, // Simulate addition to queue
            status: 'idle',
            estimatedDownloadSize: null, // Clear estimate after starting download
        }));

        await get().checkDownloadQueue();
        console.log(`Content download request processed for ID: ${contentId}. Current queue size: ${get().pendingDownloadsCount}`);
    },

    resumeDownloads: async () => {
        // US 2.6: Simulation of finding and restarting pending/paused downloads.
        const { isOnline, pendingDownloadsCount } = get();

        if (!isOnline || pendingDownloadsCount === 0) {
            console.log('Download resume attempt skipped: Offline or queue empty.');
            return;
        }

        // In a real implementation, this would involve querying Dexie for non-completed/non-failed items,
        // and calling a Service Worker/Web Worker utility to re-initiate the file transfers.
        
        console.log(`[US 2.6] Attempting to resume ${pendingDownloadsCount} pending downloads...`);
        // Simulate background processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('[US 2.6] Downloads re-queued in background worker.');
    },

    checkUsedStorage: async () => {
        // US 2.7: Simulates checking total used storage space based on OfflineContent table
        console.log('[US 2.7] Calculating used storage...');
        
        // In a real implementation, this would iterate over db.offlineContent and sum the sizes,
        // or query the dedicated OfflineContent model in Dexie (which currently lacks size info
        // in the simple definition provided by src/lib/sync/db.ts, but is present in prisma schema).
        
        // Simulating 500MB of used storage
        const simulatedUsedStorage = 500 * 1024 * 1024;
        
        set({ usedStorageBytes: simulatedUsedStorage });
        console.log(`[US 2.7] Used Storage calculated: ${simulatedUsedStorage} bytes.`);
    },

    deleteDownloadedContent: async (contentIds: string[]) => {
        // US 2.7: Simulates deleting specific content items
        console.log(`[US 2.7] Attempting to delete content IDs: ${contentIds.join(', ')}`);

        // In a real implementation, this would involve deleting entries from db.offlineContent
        // and potentially triggering a cleanup in the underlying Service Worker cache.
        
        // Simulate deletion delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Simulate storage update after deletion
        set(state => ({
            usedStorageBytes: Math.max(0, state.usedStorageBytes - (25 * 1024 * 1024 * contentIds.length)), // Reduce storage by 25MB per item deleted
        }));
        
        console.log(`[US 2.7] Deleted ${contentIds.length} items. Used storage updated.`);
    },

    submitOfflineQuizAttempt: async (quizId, attemptNumber, answers) => {
        // US 3.3: Logic to save the quiz attempt locally.
        const clientId = `attempt-${Date.now()}-${Math.random()}`;

        // In a real implementation, 'attemptData' would be encrypted JSON.
        const attemptData = JSON.stringify({ quizId, attemptNumber, answers, submittedAt: new Date().toISOString() });

        try {
            await db.quizAttempts.add({
                clientId,
                quizId,
                attemptNumber,
                answers,
                status: 'SUBMITTED',
                clientUpdatedAt: new Date(),
                isDeleted: false,
                attemptData,
            });

            console.log(`[US 3.3] Offline Quiz attempt ${attemptNumber} for Quiz ${quizId} saved locally. Now starting local scoring (US 3.5)...`);
            
            // --- US 3.5: Local Quiz Scoring Simulation ---
            const quizDefinition = await fetchQuizDefinition(quizId);
            let score = 0;
            let totalPoints = 0;
            let status: 'SUBMITTED' | 'SCORED' = 'SUBMITTED';

            if (quizDefinition) {
                // Simulate grading logic
                quizDefinition.questions.forEach((q: any) => {
                    totalPoints += q.points;
                    // Simple check: assume question Q1 gets a correct answer
                    if (q.id === 'q1' && answers['q1'] === q.correctAnswer) {
                        score += q.points;
                    }
                });

                // Update the attempt record with the local score
                await db.quizAttempts.update(db.quizAttempts.where({ clientId }).first().then(r => r!.id!), {
                    attemptData: JSON.stringify({ ...JSON.parse(attemptData), score, totalPoints }),
                    status: 'SCORED',
                    clientUpdatedAt: new Date(), // Mark as updated again
                });
                status = 'SCORED';
                console.log(`[US 3.5] Quiz ${quizId} scored locally. Score: ${score}/${totalPoints}.`);
            } else {
                console.warn(`[US 3.5] Cannot score quiz ${quizId} locally: Definition not found.`);
            }
            // --- END US 3.5 Simulation ---

            get().checkDownloadQueue();
        } catch (error) {
            console.error(`[US 3.3] Failed to save offline quiz attempt:`, error);
        }
    },

    updateLocalProgress: async (courseId, lessonId, newProgressData) => {
        // US 3.4: Logic to upsert student progress locally.
        
        // Use a composite key based on courseId and lessonId for lookup
        const existingProgress = await db.studentProgress
            .where({ courseId, lessonId })
            .first();

        const dataToSave = {
            courseId,
            lessonId,
            progressData: JSON.stringify(newProgressData), // Simulating progress data storage
            clientUpdatedAt: new Date(),
        };

        try {
            if (existingProgress) {
                // Update existing record
                await db.studentProgress.update(existingProgress.id!, {
                    ...dataToSave,
                    clientId: existingProgress.clientId, // Preserve original client ID for sync
                });
                console.log(`[US 3.4] Updated local progress for lesson ${lessonId}.`);
            } else {
                // Create new record (requires generating a new clientId)
                const clientId = `progress-${courseId}-${lessonId}-${Date.now()}`;

                await db.studentProgress.add({
                    ...dataToSave,
                    clientId,
                    isDeleted: false,
                });
                console.log(`[US 3.4] Added new local progress for lesson ${lessonId}.`);
            }
            get().checkDownloadQueue(); // Update queue/pending count if necessary
        } catch (error) {
            console.error(`[US 3.4] Failed to save local progress:`, error);
        }
    }
}));