'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Edit,
  MoreVertical,
  Trash2,
  Eye,
  Users,
  BookOpen,
  Clock,
  Star,
  Globe,
  WifiOff,
  Copy,
  Archive,
} from 'lucide-react';
import { getStatusColor, formatDuration } from '@/lib/course-utils';
import { toast } from 'sonner';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    subtitle?: string | null;
    description?: string | null;
    status: string;
    language: string;
    level: string;
    contentType: string;
    totalSections: number;
    totalLectures: number;
    totalDuration: number;
    totalEnrollments: number;
    totalReviews: number;
    averageRating: number;
    isPublic: boolean;
    offlineAvailable: boolean;
    requiresOnline: boolean;
    publishedAt?: Date | null;
    updatedAt: Date;
    tags?: string[];
  };
  onDelete?: (courseId: string) => void;
  onDuplicate?: (courseId: string) => void;
}

export function CourseCard({ course, onDelete, onDuplicate }: CourseCardProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    router.push(`/dashboard/teacher/courses/course-builder/${course.id}`);
  };

  const handlePreview = () => {
    router.push(`/dashboard/teacher/courses/${course.id}`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/teacher/courses/builder/${course.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      toast.success('Course archived successfully');
      setShowDeleteDialog(false);
      
      if (onDelete) {
        onDelete(course.id);
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to archive course');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicate = () => {
    if (onDuplicate) {
      onDuplicate(course.id);
      toast.success('Course duplicated successfully');
    }
  };

  const statusColor = getStatusColor(course.status);

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={statusColor}>{course.status}</Badge>
                <Badge variant="outline">{course.language}</Badge>
                <Badge variant="outline">{course.level}</Badge>
                {course.offlineAvailable && (
                  <Badge variant="secondary" className="gap-1">
                    <WifiOff className="h-3 w-3" />
                    Offline
                  </Badge>
                )}
                {course.isPublic && (
                  <Badge variant="secondary" className="gap-1">
                    <Globe className="h-3 w-3" />
                    Public
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl line-clamp-2">{course.title}</CardTitle>
              {course.subtitle && (
                <CardDescription className="line-clamp-1">
                  {course.subtitle}
                </CardDescription>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Course
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePreview}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicate}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent>
          {course.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {course.description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span>
                {course.totalSections} sections, {course.totalLectures} lectures
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{formatDuration(course.totalDuration)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{course.totalEnrollments} students</span>
            </div>
            {course.totalReviews > 0 && (
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span>
                  {course.averageRating.toFixed(1)} ({course.totalReviews} reviews)
                </span>
              </div>
            )}
          </div>

          {course.tags && course.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-4">
              {course.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {course.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{course.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between items-center pt-4 border-t">
          <div className="text-xs text-muted-foreground">
            Updated {new Date(course.updatedAt).toLocaleDateString()}
          </div>
          <Button onClick={handleEdit} size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive this course?</AlertDialogTitle>
            <AlertDialogDescription>
              This will archive "{course.title}". Students will no longer be able to access it.
              You can restore it later from the archived courses section.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Archiving...' : 'Archive Course'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
