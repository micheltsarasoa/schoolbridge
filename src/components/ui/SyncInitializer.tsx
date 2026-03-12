"use client";

import { useAutoSync } from '@/hooks/useAutoSync';

const SyncInitializer = () => {
  useAutoSync();
  return null;
};

export default SyncInitializer;