// src/app/api/sync/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/auth'; // Use the NextAuth v5 'auth' function for server session
import { handleSync } from '@/lib/sync/sync-server-handler';
import { SyncRequestPayload } from '@/lib/sync/protocol';

/**
 * Unified Delta Synchronization Endpoint (PUSH & PULL).
 * Handles client mutations (PUSH), applies LWW, and returns server deltas (PULL).
 * 
 * @param request The incoming NextRequest object.
 * @returns A NextResponse containing the SyncResponsePayload.
 */
export async function POST(request: Request) {
    try {
        // 1. Authentication and Authorization
        const session = await auth();

        if (!session || !session.user?.id) {
            return new NextResponse(JSON.stringify({ success: false, error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        
        // Ensure session token is available for key derivation
        // In NextAuth, the JWT or session object often holds a token usable for derivation.
        // Assuming the session provides a field named `sessionToken` or we use the JWE string.
        // For simplicity and alignment with the client-side `syncData` signature, 
        // we'll use the JWT/JWE string itself as the high-entropy sessionToken.
        const sessionToken = (session as any).jwe || (session as any).jwt; 
        if (!sessionToken) {
            // Fallback: This depends heavily on NextAuth configuration. If the JWT is not exposed, 
            // we might need to derive the key from something else, like the user's password hash (not ideal) 
            // or ensure the session object contains a suitable token.
            console.error("Session token/JWE not found on session object for crypto key derivation.");
            return new NextResponse(JSON.stringify({ success: false, error: 'Session token missing' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        
        const userId = session.user.id;
        
        // 2. Parse Payload
        const payload: SyncRequestPayload = await request.json();

        // 3. Process Sync Operation
        const syncResponse = await handleSync(payload, sessionToken, userId);

        // 4. Return Response
        return new NextResponse(JSON.stringify(syncResponse), {
            status: syncResponse.success ? 200 : 500,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('API Sync Route Error:', error);
        
        return new NextResponse(JSON.stringify({ 
            success: false, 
            error: 'An unexpected error occurred during synchronization.' 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// NOTE: Depending on the Prisma model structure, we might need a GET handler 
// to initially fetch all required read-only data (like courses/courseContent), 
// but the current task is focused only on the delta sync POST endpoint.