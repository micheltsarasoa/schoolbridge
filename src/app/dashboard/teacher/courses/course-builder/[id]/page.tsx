import CourseCreationPage from '@/components/course/course-creation-page';

interface EditCoursePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { id } = await params;
  return <CourseCreationPage courseId={id} />;
}
