import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// GET /api/teacher/courses/list - Get all courses created by the current teacher
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'TEACHER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get instructor ID
    const instructor = await prisma.instructor.findUnique({
      where: { userId: session.user.id },
    });

    if (!instructor) {
      return NextResponse.json(
        { message: 'Instructor profile not found' },
        { status: 404 }
      );
    }

    // Fetch all courses for this instructor
    const courses = await prisma.course.findMany({
      where: {
        instructorId: instructor.id,
        status: {
          not: 'ARCHIVED', // Don't show archived courses
        },
      },
      include: {
        Category: true,
        Section: {
          include: {
            Lecture: true,
          },
        },
        Statistics: true,
        _count: {
          select: {
            Section: true,
            CourseEnrollment: true,
            Review: true,
          },
        },
      },
      orderBy: [
        { status: 'asc' }, // DRAFT first, then PUBLISHED
        { updatedAt: 'desc' },
      ],
    });

    // Transform and group by category
    const groupedCourses = courses.reduce((acc, course) => {
      const categoryName = course.Category?.name || 'Uncategorized';
      const categoryId = course.Category?.id || 'uncategorized';

      if (!acc[categoryId]) {
        acc[categoryId] = {
          categoryId,
          categoryName,
          courses: [],
        };
      }

      // Calculate total lectures
      const totalLectures = course.Section.reduce(
        (sum, section) => sum + section.Lecture.length,
        0
      );

      // Calculate total duration from sections
      const totalDuration = course.Section.reduce(
        (sum, section) => sum + (section.totalDuration || 0),
        0
      );

      acc[categoryId].courses.push({
        id: course.id,
        uuid: course.uuid,
        title: course.title,
        slug: course.slug,
        subtitle: course.subtitle,
        description: course.description,
        language: course.language,
        level: course.level,
        contentType: course.contentType,
        status: course.status,
        isPublic: course.isPublic,
        publishedAt: course.publishedAt,
        lastUpdatedAt: course.lastUpdatedAt,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        totalSections: course._count.Section,
        totalLectures,
        totalDuration,
        totalEnrollments: course._count.CourseEnrollment,
        totalReviews: course._count.Review,
        averageRating: course.Statistics?.averageRating || 0,
        offlineAvailable: course.offlineAvailable,
        requiresOnline: course.requiresOnline,
        tags: course.tags,
      });

      return acc;
    }, {} as Record<string, { categoryId: string; categoryName: string; courses: any[] }>);

    // Convert to array
    const result = Object.values(groupedCourses);

    return NextResponse.json({
      success: true,
      categories: result,
      totalCourses: courses.length,
    });
  } catch (error) {
    console.error('Error fetching teacher courses:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch courses',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
