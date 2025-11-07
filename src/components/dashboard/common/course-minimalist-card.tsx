import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Course {
  id: string
  title: string
  teacher: string
  progress: number
  currentModule: string | null
  lastAccessed: string
  subject: string
}

interface CourseMinimalistCardProps {
  course: Course
}

export function CourseMinimalistCard({ course }: CourseMinimalistCardProps) {
  const isComplete = course.progress === 100
  const progressColor = isComplete ? "text-green-500" : "text-orange-500"

  return (
    <Card key={course.id}>
      <CardHeader>
        <CardTitle className="text-lg">{course.title}</CardTitle>
        <CardDescription>{course.teacher}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm mb-2">
          { !isComplete && <span>Progress</span>}
          <span className={progressColor}>
            {isComplete ? "Complete" : `${course.progress}%`}
          </span>
        </div>
        <Progress value={course.progress} className="h-2" />
        {course.currentModule && (
          <p className="text-xs text-muted-foreground mt-2">
            Current: {course.currentModule}
          </p>
        )}
      </CardContent>
      <div className="flex justify-between items-center p-4 pt-0">
        <Button variant="secondary" size="sm" asChild>
          <a href={`/student/courses/${course.id}`}>Continue Learning</a>
        </Button>
        <Badge variant="outline">{course.subject}</Badge>
      </div>
    </Card>
  )
}