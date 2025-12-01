import { useState } from 'react';
import type { Course } from '@/types/course';

export function useCourseAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCourse = async (course: Partial<Course>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/teacher/courses/builder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ course }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create course');
      }

      return data.course;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create course';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateCourse = async (id: string, course: Partial<Course>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/teacher/courses/builder/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ course }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update course');
      }

      return data.course;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update course';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const getCourse = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/teacher/courses/builder/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch course');
      }

      return data.course;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch course';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/teacher/courses/builder/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete course');
      }

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete course';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    createCourse,
    updateCourse,
    getCourse,
    deleteCourse,
    loading,
    error,
  };
}
