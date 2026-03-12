// src/hooks/useAutoSync.ts
"use client";

import { useEffect, useRef } from 'react';
import { useSyncStore } from '@/stores/useSyncStore';
import { useSession } from 'next-auth/react';
import { useOnlineStatus } from './useOnlineStatus'; // Assuming a utility hook for online status

const SYNC_DEBOUNCE_MS = 5000;
const AUTO_SYNC_INTERVAL_MS = 3600000; // 1 hour (3,600,000 ms)

/**
 * Custom hook to handle automatic data synchronization logic.
 * Triggers sync on connectivity change (after debounce) and on a set interval.
 */
export const useAutoSync = () => {
    const { data: session } = useSession();
    const { startSync, status, setIsOnline } = useSyncStore();
    const isOnline = useOnlineStatus(); 
    const isSyncingRef = useRef(false);

    // 1. Connectivity Check (US 4.2)
    useEffect(() => {
        setIsOnline(isOnline);
        
        if (isOnline && status !== 'syncing') {
            const timer = setTimeout(() => {
                console.log('Connectivity regained. Triggering sync after debounce.');
                // Assuming session.data.token exists for authenticated requests
                if ((session?.data as any)?.token && session?.user?.id) {
                    startSync((session.data as any).token, session.user.id);
                }
            }, SYNC_DEBOUNCE_MS);
            
            return () => clearTimeout(timer);
        }
    }, [isOnline, session, startSync, setIsOnline, status]);

    // 2. Interval Sync (Background, US 4.2)
    useEffect(() => {
        if (status === 'syncing' || !isOnline) {
            isSyncingRef.current = true;
            return;
        }

        const interval = setInterval(() => {
            console.log('Scheduled background sync triggered.');
            if ((session?.data as any)?.token && session?.user?.id) {
                startSync((session.data as any).token, session.user.id);
            }
        }, AUTO_SYNC_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [session, startSync, isOnline, status]);
    
    // Initialize the store state (e.g., last sync time, queue status)
    const initialize = useSyncStore(state => state.initialize);
    useEffect(() => {
        initialize();
    }, [initialize]);
};