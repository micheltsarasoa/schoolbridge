
'use client';

import { useRole } from "@/hooks/useRole";
import { UserRole } from "@/generated/prisma";
import UserTable from "@/components/admin/UserTable";
import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminDashboardPage() {
  const { isAuthorized, isLoading } = useRole(UserRole.ADMIN);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return (
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-4">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p className="mt-2 text-gray-600 mb-8">Welcome, Admin! Here you can manage users, schools, and courses.</p>

      <SectionCards />

      <div className="grid gap-4 @container/main lg:grid-cols-2 xl:grid-cols-3 mt-8">
        <ChartAreaInteractive />
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage all users in the system.</CardDescription>
          </CardHeader>
          <CardContent>
            <UserTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
