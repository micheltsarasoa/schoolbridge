
import { CourseHeader } from "@/components/course/course-viewer/course-header"
import { CourseMainContent } from "@/components/course/course-viewer/course-main-content"
import { CourseContentSidebar } from "@/components/course/course-viewer/course-content-sidebar"

export function CoursePage() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <CourseHeader />

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main Course Content */}
          <CourseMainContent />

          {/* Right Sidebar */}
          <CourseContentSidebar />
        </div>
      </div>
    </div>
  )
}
