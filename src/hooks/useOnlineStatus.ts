// src/hooks/useOnlineStatus.ts
"use client";

import { useEffect, useState } from 'react';

/**
 * Custom hook to track the online status of the browser.
 * This is crucial for offline-first applications (US 4.2).
 */
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(true); // Assume online on mount for PWA

  useEffect(() => {
    // Initial check (especially important when client components hydrate)
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};