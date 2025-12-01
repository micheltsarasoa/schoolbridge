'use client';

import { useState, useEffect } from 'react';
import { SchoolDataTable } from '@/components/schools/data-table';
import { columns, School } from '@/components/schools/columns';
import { Loader2 } from 'lucide-react';

async function getSchools(): Promise<School[]> {
  const res = await fetch('/api/schools');
  if (!res.ok) {
    throw new Error('Failed to fetch schools');
  }
  const data = await res.json();
  return data.schools;
}

export function SchoolTable() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const schoolData = await getSchools();
      setSchools(schoolData);
      setError(null);
    } catch (err) {
      setError('Failed to load schools. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <SchoolDataTable columns={columns} data={schools} onSuccess={fetchSchools} />
  );
}
