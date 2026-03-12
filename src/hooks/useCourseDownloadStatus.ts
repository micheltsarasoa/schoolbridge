import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/sync/db";

// Define possible download statuses
export type CourseDownloadStatus = 'not_started' | 'partial' | 'downloaded' | 'pending' | 'error';

/**
 * Hook to get the download status for a list of courses.
 * 
 * NOTE: The "pending" and "error" statuses are complex to derive solely from 
 * local CourseContent count without a more complex state management/queue system.
 * For US 2.1, we focus on 'not_started', 'partial', and 'downloaded' status based on 
 * comparing local content count against the server-reported total content count.
 * 
 * @param courses Array of courses with their server-reported `contentCount`.
 * @returns An object containing both the status map and the local content counts map.
 */
export function useCourseDownloadStatuses(courseIds: string[], serverContentCounts: Map<string, number>): {
  statuses: Map<string, CourseDownloadStatus>;
  localContentCounts: Map<string, number> | undefined;
} {
    
    // We fetch the count of locally downloaded CourseContent for each course ID
    const localContentCounts = useLiveQuery(
        async () => {
            const counts = new Map<string, number>();
            
            // Note: Dexie.js useLiveQuery dependency array for complex structures like courseIds is tricky.
            // When courseIds changes, this query automatically re-runs.
            
            for (const courseId of courseIds) {
                const count = await db.courseContent.where('courseId').equals(courseId).count();
                counts.set(courseId, count);
            }
            return counts;
        },
        [courseIds]
    );

    const statuses = new Map<string, CourseDownloadStatus>();

    // Derive the status for each course
    for (const courseId of courseIds) {
        const serverCount = serverContentCounts.get(courseId) ?? 0;
        const localCount = localContentCounts?.get(courseId) ?? 0;

        let status: CourseDownloadStatus;

        if (serverCount === 0) {
            // A course with no content is considered 'downloaded' (or irrelevant for download)
            status = 'downloaded';
        } else if (localCount === 0) {
            status = 'not_started';
        } else if (localCount >= serverCount) {
            // Treat localCount >= serverCount as complete, accounting for potential server-side data drift
            status = 'downloaded';
        } else {
            status = 'partial';
        }

        statuses.set(courseId, status);
    }
    
    return { statuses, localContentCounts };
}

// Helper to get the download percentage for a course
export function getDownloadPercentage(courseId: string, localContentCounts: Map<string, number> | undefined, serverContentCounts: Map<string, number>): number {
    const serverCount = serverContentCounts.get(courseId) ?? 0;
    const localCount = localContentCounts?.get(courseId) ?? 0;
    
    if (serverCount === 0) return 100;
    
    return Math.min(100, Math.floor((localCount / serverCount) * 100));
}