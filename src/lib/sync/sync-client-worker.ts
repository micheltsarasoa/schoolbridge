// src/lib/sync/sync-client-worker.ts

import { syncData } from './protocol';

/**
 * Worker Message Protocol
 * Sent from Main Thread: { type: 'START_SYNC', sessionToken: string, userId: string }
 * Sent from Worker: { type: 'SYNC_COMPLETE', success: boolean }
 * Sent from Worker: { type: 'SYNC_ERROR', error: string }
 */

// Explicitly define self as a Web Worker Global Scope
const worker: Worker = self as any;

worker.onmessage = async (event: MessageEvent) => {
    const { type, sessionToken, userId } = event.data;

    if (type === 'START_SYNC') {
        if (!sessionToken || !userId) {
            worker.postMessage({ type: 'SYNC_ERROR', error: 'Missing sessionToken or userId.' });
            return;
        }

        try {
            // syncData implements the full PUSH-PULL flow, including
            // dirty record identification, encryption/decryption, API call,
            // delta application, and lastSyncTimestamp update.
            const success = await syncData(sessionToken, userId);

            worker.postMessage({ type: 'SYNC_COMPLETE', success });
        } catch (error) {
            console.error('Worker Sync Error:', error);
            worker.postMessage({ type: 'SYNC_ERROR', error: error instanceof Error ? error.message : String(error) });
        }
    }
};

// Log for worker initialization confirmation
console.log('Sync Client Worker Initialized');