"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUpdateProgress } from '@/hooks/useUpdateProgress';
import { useSyncStore } from '@/stores/useSyncStore';
import { useState } from 'react';
import { getStudentProgress } from '@/lib/sync/data-access';

// Placeholder/Mock ID for demonstration
// This ID must exist in Dexie/Server for the demo to work fully.
const DEMO_CLIENT_ID = '0000-demo-progress-id-0000';

// This client component demonstrates data access and mutation
function SyncDemoComponent() {
  const { updateProgress, isLoading, error } = useUpdateProgress();
  const syncStatus = useSyncStore((state) => state.status);
  const isOnline = useSyncStore((state) => state.isOnline);
  const [dataStatus, setDataStatus] = useState('N/A');

  const handleUpdate = () => {
    // Generate a unique progress string to demonstrate local change
    const newProgress = `Progress updated at ${new Date().toLocaleTimeString()}`;
    updateProgress({ clientId: DEMO_CLIENT_ID, newProgressData: newProgress });
  };
  
  const handleFetch = async () => {
    setDataStatus('Fetching...');
    try {
        const data = await getStudentProgress(DEMO_CLIENT_ID);
        if (data) {
            setDataStatus(`Found: ${data.progressData.substring(0, 30)}...`);
        } else {
            setDataStatus('Not Found Locally/Remotely.');
        }
    } catch (e) {
        setDataStatus('Fetch Error. Check Console.');
    }
  };


  return (
    <div className="w-full max-w-md mx-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">SchoolBridge</CardTitle>
          <CardDescription>
            Bridging Education Gaps, Online and Offline
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Connect teachers, students, and parents in an offline-first platform.
          </p>
          
          <div className="border p-4 rounded-md space-y-2">
            <h3 className="font-semibold text-lg">Sync Demonstration</h3>
            <p>
              Status: <span className={`font-mono font-bold ${syncStatus === 'syncing' ? 'text-yellow-600' : 'text-green-600'}`}>{syncStatus}</span>
            </p>
            <p>
              Online: <span className="font-mono font-bold">{isOnline ? 'Yes' : 'No'}</span>
            </p>
            <p>
              Data Status: <span className="font-mono text-sm">{dataStatus}</span>
            </p>

            <div className="flex flex-col gap-2">
                <Button
                    onClick={handleFetch}
                    disabled={isLoading}
                    variant="secondary"
                    className="w-full"
                >
                    1. Read Data (Hybrid Access)
                </Button>
                <Button
                    onClick={handleUpdate}
                    disabled={isLoading || syncStatus === 'syncing'}
                    className="w-full"
                >
                    2. Mutate Local Data & Trigger Sync
                </Button>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {isLoading && <p className="text-sm text-center">Mutating...</p>}
            </div>
          </div>


          <div className="flex flex-col gap-3">
            <Button asChild size="lg" className="w-full">
              <Link href="/login">
                Sign In
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/register">
                Create Account
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/*
        This wrapper is temporary to demonstrate the PWA sync loop.
        In a real app, this should only be mounted on the client.
      */}
      <SyncDemoComponent />
    </div>
  );
}
