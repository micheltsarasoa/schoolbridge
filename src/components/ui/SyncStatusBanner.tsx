"use client";
import React from 'react';
import { useSyncStore } from '@/stores/useSyncStore';
import { Clock, CheckCircle, AlertTriangle, Wifi, XCircle } from 'lucide-react';

const SyncStatusBanner: React.FC = () => {
  const { status, isOnline, lastSuccessfulSync, syncError } = useSyncStore();

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    switch (status) {
      case 'syncing':
        return 'Synchronizing...';
      case 'success':
        return 'Synced';
      case 'error':
        return 'Sync Error';
      case 'idle':
      default:
        return 'Ready to sync';
    }
  };

  const getStatusIcon = () => {
    if (!isOnline) return <XCircle className="w-4 h-4 mr-2 text-red-500" />;
    
    switch (status) {
      case 'syncing':
        return <Clock className="w-4 h-4 mr-2 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 mr-2 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />;
      case 'idle':
      default:
        return <Wifi className="w-4 h-4 mr-2 text-gray-500" />;
    }
  };

  const getBannerStyle = () => {
    if (!isOnline) return 'bg-red-100 border-red-400 text-red-700';
    
    switch (status) {
      case 'syncing':
        return 'bg-blue-100 border-blue-400 text-blue-700';
      case 'success':
        return 'bg-green-100 border-green-400 text-green-700';
      case 'error':
        return 'bg-yellow-100 border-yellow-400 text-yellow-700';
      case 'idle':
      default:
        return 'bg-gray-100 border-gray-400 text-gray-700';
    }
  };

  const formattedLastSync = lastSuccessfulSync 
    ? new Date(lastSuccessfulSync).toLocaleTimeString() 
    : 'Never';

  // Only display the banner when syncing, error, or offline (or if lastSuccessfulSync is null and we are online but idle)
  // For integration in layout, we want it to show up consistently if status is not 'success' and 'idle' while online.
  if (status === 'idle' && isOnline && lastSuccessfulSync) {
    // If successful and idle, we don't show the banner to avoid visual clutter, 
    // assuming sync is fine if it was successful recently.
    return null; 
  }

  return (
    <div className={`p-2 border rounded-md shadow-lg flex items-center text-sm ${getBannerStyle()}`}>
      {getStatusIcon()}
      <div>
        <span className="font-semibold">{getStatusText()}</span>
        {status !== 'syncing' && (
          <span className="ml-4 text-xs">
            {isOnline ? `Last sync: ${formattedLastSync}` : `Last attempt: ${formattedLastSync}`}
          </span>
        )}
        {syncError && status === 'error' && (
          <p className="mt-1 text-xs font-medium italic">{syncError}</p>
        )}
      </div>
    </div>
  );
};

export default SyncStatusBanner;