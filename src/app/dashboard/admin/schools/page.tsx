'use client';

import { SchoolTable } from "@/components/schools/SchoolTable";

export default function SchoolManagementPage() {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6">School Management</h1>
      <SchoolTable />
    </div>
  );
}