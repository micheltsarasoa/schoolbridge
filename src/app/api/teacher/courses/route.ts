import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// GET /api/teacher/courses - Get courses taught by the current teacher, grouped by subject
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'TEACHER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const teacherId = session.user.id;

    const courses = await prisma.course.findMany({
      where: {
        teacherId,
        status: 'PUBLISHED', // Only show published courses
      },
      select: {
        id: true,
        title: true,
        subjectId: true,
        subject: {
          select: {
            id: true,
            name: true,
          },
        },
        content: {
          select: {
            offlineAvailable: true,
          },
        },
      },
      orderBy: {
        title: 'asc',
      },
    });

    // Check if any content is offline available
    const coursesWithOffline = courses.map(course => ({
      id: course.id,
      title: course.title,
      subjectId: course.subjectId,
      subjectName: course.subject.name,
      hasOfflineContent: course.content.some(c => c.offlineAvailable),
    }));

    // Group courses by subject
    const groupedBySubject = coursesWithOffline.reduce((acc, course) => {
      const subjectName = course.subjectName;
      if (!acc[subjectName]) {
        acc[subjectName] = {
          subjectId: course.subjectId,
          subjectName: subjectName,
          courses: [],
        };
      }
      acc[subjectName].courses.push({
        id: course.id,
        title: course.title,
        hasOfflineContent: course.hasOfflineContent,
      });
      return acc;
    }, {} as Record<string, { subjectId: string; subjectName: string; courses: { id: string; title: string; hasOfflineContent: boolean }[] }>);

    // Convert to array
    const result = Object.values(groupedBySubject);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching teacher courses:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
