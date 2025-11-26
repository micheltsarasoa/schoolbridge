'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Course, Section, Lecture, LectureType } from '@/types/course'
import { generateId, validateCourse } from '@/lib/course-utils';
import { useCourseAPI } from '@/hooks/use-course-api';
import { CourseHeader } from '@/components/course/course-header';
import { CourseSidebar } from '@/components/course/course-sidebar';
import { SectionEditor } from '@/components/course/section-editor';
import { LectureEditorRouter } from '@/components/course/lecture-editor-router';
import { EmptyState } from '@/components/course/empty-state';
import { toast, Toaster } from 'sonner';

export default function CourseCreationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams?.get('id');
  const { createCourse, updateCourse, getCourse, loading: apiLoading } = useCourseAPI();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedLecture, setSelectedLecture] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<'section' | 'lecture' | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoadingCourse, setIsLoadingCourse] = useState(false);

  // Initialize course
  useEffect(() => {
    const loadCourse = async () => {
      if (courseId) {
        // Load existing course from API
        setIsLoadingCourse(true);
        try {
          const fetchedCourse = await getCourse(courseId);
          setCourse(fetchedCourse);
          setExpandedSections(new Set(fetchedCourse.sections.map((s: Section) => s.id)));
          setLastSaved(new Date(fetchedCourse.updatedAt));
          toast.success('Course loaded successfully');
        } catch (error) {
          console.error('Failed to load course:', error);
          toast.error('Failed to load course');
          initializeNewCourse();
        } finally {
          setIsLoadingCourse(false);
        }
      } else {
        // Try to load from localStorage for draft
        const savedCourse = localStorage.getItem('course_draft');
        if (savedCourse) {
          try {
            const parsed = JSON.parse(savedCourse);
            setCourse(parsed);
            setExpandedSections(new Set(parsed.sections.map((s: Section) => s.id)));
          } catch (e) {
            console.error('Failed to parse saved course', e);
            initializeNewCourse();
          }
        } else {
          initializeNewCourse();
        }
      }
    };

    loadCourse();
  }, [courseId]);

  const initializeNewCourse = () => {
    const newCourse: Course = {
      id: generateId(),
      title: '',
      language: 'FR',
      level: 'BEGINNER',
      contentType: 'HYBRID',
      status: 'DRAFT',
      sections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCourse(newCourse);
  };

  // Auto-save
  useEffect(() => {
    if (hasUnsavedChanges && course) {
      const timer = setTimeout(() => {
        saveCourse();
      }, 30000); // 30 seconds
      return () => clearTimeout(timer);
    }
  }, [hasUnsavedChanges, course]);

  const saveCourse = async () => {
    if (!course) return;

    // Validate course before saving
    const validation = validateCourse(course);
    if (!validation.isValid) {
      toast.error('Please fix the following errors:', {
        description: validation.errors.slice(0, 3).join(', '),
        duration: 5000,
      });
      console.error('Validation errors:', validation.errors);
      return;
    }

    setIsSaving(true);
    try {
      if (courseId) {
        // Update existing course
        const updated = await updateCourse(courseId, course);
        setCourse(updated);
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
        toast.success('Course updated successfully');
        // Also save to localStorage as backup
        localStorage.setItem('course_draft', JSON.stringify({
          ...course,
          updatedAt: new Date().toISOString()
        }));
      } else {
        // Create new course
        const created = await createCourse(course);
        setCourse(created);
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
        toast.success('Course created successfully');
        // Clear localStorage after successful creation
        localStorage.removeItem('course_draft');
        // Navigate to edit mode with the new ID
        router.push(`/dashboard/teacher/courses/course-builder?id=${created.id}`);
      }
    } catch (e) {
      console.error('Failed to save course:', e);
      toast.error('Failed to save course', {
        description: e instanceof Error ? e.message : 'Unknown error',
      });
      // Save to localStorage as fallback
      localStorage.setItem('course_draft', JSON.stringify({
        ...course,
        updatedAt: new Date().toISOString()
      }));
    } finally {
      setIsSaving(false);
    }
  };

  const updateCourseMetadata = (field: string, value: any) => {
    setCourse(prev => prev ? {
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString()
    } : null);
    setHasUnsavedChanges(true);
  };

  const addSection = () => {
    if (!course) return;
    
    const newSection: Section = {
      id: generateId(),
      title: `Section ${course.sections.length + 1}`,
      description: '',
      order: course.sections.length + 1,
      lectures: []
    };
    
    setCourse(prev => prev ? {
      ...prev,
      sections: [...prev.sections, newSection]
    } : null);
    
    setSelectedSection(newSection.id);
    setSelectedLecture(null);
    setEditorMode('section');
    setExpandedSections(prev => new Set([...prev, newSection.id]));
    setHasUnsavedChanges(true);
  };

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    setCourse(prev => prev ? {
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    } : null);
    setHasUnsavedChanges(true);
  };

  const deleteSection = (sectionId: string) => {
    if (confirm('Are you sure you want to delete this section and all its lectures?')) {
      setCourse(prev => prev ? {
        ...prev,
        sections: prev.sections
          .filter(s => s.id !== sectionId)
          .map((s, index) => ({ ...s, order: index + 1 }))
      } : null);
      if (selectedSection === sectionId) {
        setSelectedSection(null);
        setEditorMode(null);
      }
      setHasUnsavedChanges(true);
      toast.success('The section has been removed', {
        description: 'Section deleted',
      });
    }
  };

  const addLecture = (sectionId: string, type: LectureType) => {
    if (!course) return;
    
    const section = course.sections.find(s => s.id === sectionId);
    if (!section) return;
    
    const newLecture: Lecture = {
      id: generateId(),
      title: `New ${type} Lecture`,
      description: '',
      type,
      order: section.lectures.length + 1,
      isPreview: false,
      isFree: false,
      offlineAvailable: true,
      resources: []
    };
    
    // Initialize type-specific data
    switch (type) {
      case 'VIDEO':
        newLecture.video = {
          defaultQuality: 'MEDIUM',
          offlineOptimized: false
        };
        break;
      case 'ARTICLE':
        newLecture.article = {
          content: '',
          contentHtml: '',
          wordCount: 0
        };
        break;
      case 'QUIZ':
        newLecture.quiz = {
          passingScore: 70,
          attemptsAllowed: 3,
          shuffleQuestions: false,
          shuffleAnswers: false,
          showCorrectAnswers: true,
          showCorrectAnswersAfter: 'submission',
          questions: []
        };
        break;
      case 'CODING_EXERCISE':
        newLecture.codingExercise = {
          instructions: '',
          language: 'javascript',
          testCases: [],
          hints: [],
          allowSubmission: true
        };
        break;
      case 'ASSIGNMENT':
        newLecture.assignment = {
          instructions: '',
          allowedFileTypes: ['PDF'],
          maxFileSize: 10
        };
        break;
      case 'PROJECT':
        newLecture.project = {
          description: '',
          complexity: 'intermediate',
          technologies: [],
          learningObjectives: [],
          milestones: []
        };
        break;
    }
    
    updateSection(sectionId, {
      lectures: [...section.lectures, newLecture]
    });
    
    setSelectedLecture(newLecture.id);
    setSelectedSection(sectionId);
    setEditorMode('lecture');
  };

  const updateLecture = (sectionId: string, lectureId: string, updates: Partial<Lecture>) => {
    setCourse(prev => prev ? {
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              lectures: section.lectures.map(lecture =>
                lecture.id === lectureId ? { ...lecture, ...updates } : lecture
              )
            }
          : section
      )
    } : null);
    setHasUnsavedChanges(true);
  };

  const deleteLecture = (sectionId: string, lectureId: string) => {
    if (confirm('Are you sure you want to delete this lecture?')) {
      const section = course?.sections.find(s => s.id === sectionId);
      if (!section) return;
      
      updateSection(sectionId, {
        lectures: section.lectures
          .filter(l => l.id !== lectureId)
          .map((l, index) => ({ ...l, order: index + 1 }))
      });
      
      if (selectedLecture === lectureId) {
        setSelectedLecture(null);
        setEditorMode(null);
      }
      
      toast.success('The lecture has been removed', {
        description: 'Lecture deleted',
      });
    }
  };

  const getSectionById = (id: string) => course?.sections.find(s => s.id === id);
  const getLectureById = (sectionId: string, lectureId: string) => {
    const section = getSectionById(sectionId);
    return section?.lectures.find(l => l.id === lectureId);
  };

  const handleSelectSection = (sectionId: string) => {
    setSelectedSection(sectionId);
    setSelectedLecture(null);
    setEditorMode('section');
  };

  const handleSelectLecture = (sectionId: string, lectureId: string) => {
    setSelectedSection(sectionId);
    setSelectedLecture(lectureId);
    setEditorMode('lecture');
  };

  return (
    <div className="min-h-screen bg-background">
      <CourseHeader
        course={course}
        onUpdate={updateCourseMetadata}
        onSave={saveCourse}
        isSaving={isSaving}
        lastSaved={lastSaved}
        hasUnsavedChanges={hasUnsavedChanges}
      />
      
      <div className="flex gap-6 p-6">
        <CourseSidebar
          sections={course?.sections || []}
          selectedSection={selectedSection}
          selectedLecture={selectedLecture}
          expandedSections={expandedSections}
          onToggleSection={(id) => {
            setExpandedSections(prev => {
              const next = new Set(prev);
              if (next.has(id)) {
                next.delete(id);
              } else {
                next.add(id);
              }
              return next;
            });
          }}
          onSelectSection={handleSelectSection}
          onSelectLecture={handleSelectLecture}
          onAddSection={addSection}
          onAddLecture={addLecture}
          onDeleteSection={deleteSection}
          onDeleteLecture={deleteLecture}
        />
        
        <div className="flex-1 min-w-0">
          {editorMode === 'section' && selectedSection && (
            <SectionEditor
              section={getSectionById(selectedSection)!}
              onUpdate={(updates) => updateSection(selectedSection, updates)}
              onClose={() => {
                setSelectedSection(null);
                setEditorMode(null);
              }}
            />
          )}
          
          {editorMode === 'lecture' && selectedLecture && selectedSection && (
            <LectureEditorRouter
              lecture={getLectureById(selectedSection, selectedLecture)!}
              sectionId={selectedSection}
              onUpdate={(updates) => updateLecture(selectedSection, selectedLecture, updates)}
              onClose={() => {
                setSelectedLecture(null);
                setEditorMode(null);
              }}
            />
          )}
          
          {!editorMode && (
            <EmptyState onAddSection={addSection} />
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
}
