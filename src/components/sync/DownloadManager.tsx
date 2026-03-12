import React from 'react';
import { useSyncStore } from '@/stores/useSyncStore';
import { Download, Pause, Loader2, List, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming a Button component exists

// Mock functions for demonstration (these would likely interact with a sync worker)
const initiateDownload = () => console.log("Download initiated (Mock)");
const pauseDownload = () => console.log("Download paused (Mock)");

const DownloadManager: React.FC = () => {
  const { pendingDownloadsCount } = useSyncStore();

  const isDownloading = pendingDownloadsCount > 0;
  
  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Download className="w-5 h-5 mr-2" />
          Content Download Manager
        </h3>
        
        {isDownloading ? (
          <Button onClick={pauseDownload} variant="outline" size="sm" className="flex items-center">
            <Pause className="w-4 h-4 mr-2" />
            Pause Download
          </Button>
        ) : (
          <Button onClick={initiateDownload} size="sm" className="flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Start Download
          </Button>
        )}
      </div>

      <div className="flex items-center text-sm text-gray-600">
        <List className="w-4 h-4 mr-2" />
        <p>Pending items in queue: <span className="font-bold">{pendingDownloadsCount}</span></p>
      </div>

      {isDownloading && (
        <div className="mt-4 flex items-center text-blue-600">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          <p className="font-medium">Downloading content...</p>
        </div>
      )}

      {/* Placeholder for detailed list/progress (if later implemented) */}
      <div className="mt-4 p-2 border-t pt-2">
        <p className="flex items-center text-xs text-gray-500">
            <FileText className="w-3 h-3 mr-1" />
            Detailed download progress can be shown here.
        </p>
      </div>
    </div>
  );
};

export default DownloadManager;