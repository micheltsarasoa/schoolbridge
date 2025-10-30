
'use client';

import { useEffect, useState } from "react";
import { UsersIcon, BookOpenIcon, SchoolIcon, GraduationCapIcon, ClipboardListIcon, Loader2 } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CountsData {
  userCount: number;
  courseCount: number;
  schoolCount: number;
  subjectCount: number;
  classCount: number;
}

export function SectionCards() {
  const [counts, setCounts] = useState<CountsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/admin/reports/counts");
        if (!response.ok) {
          throw new Error("Failed to fetch counts. You may not have permission.");
        }
        const data = await response.json();
        setCounts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 lg:px-6">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="@container/card flex items-center justify-center h-[150px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 px-4 lg:px-6">Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 lg:px-6">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {counts?.userCount ?? 0}
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <UsersIcon className="size-4" /> Total Users
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {counts?.courseCount ?? 0}
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <BookOpenIcon className="size-4" /> Total Courses
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {counts?.schoolCount ?? 0}
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <SchoolIcon className="size-4" /> Total Schools
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {counts?.subjectCount ?? 0}
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <GraduationCapIcon className="size-4" /> Total Subjects
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {counts?.classCount ?? 0}
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <ClipboardListIcon className="size-4" /> Total Classes
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
