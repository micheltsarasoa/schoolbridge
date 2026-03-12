// src/lib/sync/data-access.ts

import { db, StudentProgress } from '@/lib/sync/db';
import { useSyncStore } from '@/stores/useSyncStore';
import { getCurrentSessionToken, getCurrentUserId } from '@/lib/sync/protocol'; // Assume these helpers exist or can be created
import { decryptData, deriveEncryptionKey } from '@/lib/sync/crypto';

// --- Server API Fetch Placeholder ---

// The structure of the data returned from the server (e.g., via /api/progress/[progressId])
interface ServerStudentProgress {
    id: string; // Server UUID
    studentId: string;
    courseId: string;
    lessonId: string;
    progressData: string; // Encrypted string
    serverUpdatedAt: Date; // Server timestamp
    clientUpdatedAt: Date | null; // Nullable if server-only
    isDeleted: boolean;
    // ... other fields
}

/**
 * Fetches StudentProgress data from the server API.
 * This is the fallback/server-first data source.
 * @param progressId The server-side UUID of the progress record.
 */
async function fetchStudentProgressFromServer(progressId: string): Promise<StudentProgress | null> {
    const sessionToken = await getCurrentSessionToken();
    const userId = await getCurrentUserId();
    
    if (!sessionToken || !userId) {
        console.warn('Cannot fetch progress: User not authenticated.');
        return null;
    }

    try {
        // Use the existing API endpoint (e.g., /api/progress/[progressId])
        const response = await fetch(`/api/progress/${progressId}`);
        
        if (!response.ok) {
            console.error(`Server fetch failed for progress ID ${progressId}: ${response.status}`);
            return null;
        }

        const data: { progress: ServerStudentProgress } = await response.json();
        const serverProgress = data.progress;

        // Decrypt the progressData field
        const encryptionKey = await deriveEncryptionKey(sessionToken, userId);
        const decryptedProgressData = await decryptData(encryptionKey, serverProgress.progressData);
        
        // Transform server model back to client model (which uses the decrypted data)
        const clientProgress: StudentProgress = {
            clientId: serverProgress.id, // We use the server ID as the clientId for non-locally created items
            courseId: serverProgress.courseId,
            lessonId: serverProgress.lessonId,
            progressData: decryptedProgressData,
            clientUpdatedAt: new Date(), // Set to now as it's the latest data
            isDeleted: serverProgress.isDeleted,
        };

        return clientProgress;

    } catch (error) {
        console.error(`Error fetching StudentProgress ${progressId} from server:`, error);
        return null;
    }
}

/**
 * Encrypts and saves StudentProgress data to the local IndexedDB.
 * Assumes progress data is a string/JSON object that needs encryption.
 * @param progress The StudentProgress entity (content field should be raw data).
 * @returns The local database ID of the saved record.
 */
export async function saveStudentProgressLocal(
    progress: Omit<StudentProgress, 'id' | 'clientUpdatedAt' | 'isDeleted'> & { progressData: string, id?: number }
): Promise<number> {
    const sessionToken = await getCurrentSessionToken();
    const userId = await getCurrentUserId();

    if (!sessionToken || !userId) {
        throw new Error('Cannot save progress locally: User not authenticated.');
    }

    // 1. Encrypt Data
    const encryptionKey = await deriveEncryptionKey(sessionToken, userId);
    const encryptedProgressData = await encryptData(encryptionKey, progress.progressData);

    // 2. Prepare client metadata
    const clientRecord: Omit<StudentProgress, 'id'> = {
        ...progress,
        progressData: encryptedProgressData, // Store encrypted data
        clientId: progress.clientId || crypto.randomUUID(), // Ensure local UUID exists
        clientUpdatedAt: new Date(),
        isDeleted: false,
    };

    // 3. Save to Dexie
    // If progress.id is provided, Dexie will perform an update. If not, it will be added.
    const id = await db.studentProgress.put(clientRecord as StudentProgress);
    return id;
}

// --- Hybrid Data Access Layer (Abstraction) ---

/**
 * Provides an abstracted access layer for StudentProgress.
 * Prioritizes local Dexie data. Falls back to server if online and no local match found.
 *
 * Note: This simplified abstraction assumes we're looking up by the StudentProgress server ID.
 * For true offline-first, the client needs a strategy to track server IDs or use local UUIDs.
 * For this demo, we assume the ID passed is the server-side UUID (id: string in StudentProgress type).
 * @param progressId The server-side UUID of the StudentProgress record.
 */
export async function getStudentProgress(progressId: string): Promise<StudentProgress | null> {
    
    // We can only use useSyncStore on the client side, so we need a way to check if we are running in the browser.
    const isClient = typeof window !== 'undefined';
    
    if (isClient) {
        const { isOnline } = useSyncStore.getState();
        
        // 1. Try Local Dexie first (Offline-First)
        // We look up by `clientId` because Dexie uses `clientId` for server records after sync.
        const localProgress = await db.studentProgress.where('clientId').equals(progressId).first();

        if (localProgress) {
            console.log(`[Data-Access] Local Dexie hit for StudentProgress ID: ${progressId}`);
            
            // 2. Decrypt locally stored data before returning
            const sessionToken = await getCurrentSessionToken();
            const userId = await getCurrentUserId();
            const encryptionKey = await deriveEncryptionKey(sessionToken, userId);
            
            const decryptedProgressData = await decryptData(encryptionKey, localProgress.progressData);
            
            return { ...localProgress, progressData: decryptedProgressData };
        }

        // 3. Fallback to Server if Online and not found locally
        if (isOnline) {
            console.log(`[Data-Access] Local miss. Falling back to server fetch for StudentProgress ID: ${progressId}`);
            const serverProgress = await fetchStudentProgressFromServer(progressId);

            if (serverProgress) {
                // Optionally: Insert the fresh server data into Dexie for future local access
                // Since this might conflict with a pending sync, we won't auto-insert here,
                // relying on the next full sync to pull it down if needed.
                return serverProgress;
            }
        }
        
        console.log(`[Data-Access] Data not found locally or on server/offline for StudentProgress ID: ${progressId}`);
        return null;

    } else {
        // 4. Server-side execution (e.g., in a server component or API route)
        // Since this module is intended for shared access, we must handle server context
        // This is where a Prisma call would typically go if this function were imported on the server.
        // For this task, we will simplify: if server-side, we assume full server capabilities are available
        // and we will rely on dedicated server-side imports (e.g., via a helper in sync-server-handler).
        
        // To avoid bringing in heavy server dependencies (like Prisma) into a potentially client bundle,
        // we'll leave the server implementation placeholder here.
        // A full implementation would conditionally load a server-side method here.
        
        // For the purpose of this abstraction *demonstration*, we will return null on the server side
        // because the primary goal is to demonstrate client-side hybrid access.
        console.warn(`[Data-Access] Function called server-side. Dedicated server access path required for full implementation.`);
        return null;
    }
}
