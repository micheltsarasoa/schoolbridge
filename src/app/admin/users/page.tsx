'use client';

import { UserTable } from "@/components/admin/UserTable";

export default function UsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">All Users</h1>
      <UserTable />
    </div>
  );
}