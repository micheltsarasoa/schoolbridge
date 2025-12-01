'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Plus, ChevronDown, ChevronRight, GripVertical, Trash2, Video, FileText, HelpCircle, Code, ClipboardList, FolderKanban, Paperclip } from 'lucide-react';
import type { Section, LectureType } from '@/types/course';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface CourseSidebarProps {
  sections: Section[];
  selectedSection: string | null;
  selectedLecture: string | null;
  expandedSections: Set<string>;
  onToggleSection: (id: string) => void;
  onSelectSection: (id: string) => void;
  onSelectLecture: (sectionId: string, lectureId: string) => void;
  onAddSection: () => void;
  onAddLecture: (sectionId: string, type: LectureType) => void;
  onDeleteSection: (id: string) => void;
  onDeleteLecture: (sectionId: string, lectureId: string) => void;
}

export function CourseSidebar({
  sections,
  selectedSection,
  selectedLecture,
  expandedSections,
  onToggleSection,
  onSelectSection,
  onSelectLecture,
  onAddSection,
  onAddLecture,
  onDeleteSection,
  onDeleteLecture,
}: CourseSidebarProps) {
  return (
    <Card className="w-80 shrink-0 sticky top-6 h-[calc(100vh-8rem)]">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          <h2 className="font-semibold">Course Outline</h2>
        </div>
      </div>

      <ScrollArea className="flex-1 h-[calc(100%-8rem)]">
        <div className="p-4 space-y-2">
          {sections.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">Start building your course</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add your first section to begin
              </p>
              <Button onClick={onAddSection}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Section
              </Button>
            </div>
          ) : (
            <>
              {sections.map((section, index) => (
                <div key={section.id} className="space-y-1">
                  <div
                    className={cn(
                      'flex items-center gap-2 p-2 rounded-lg hover:bg-accent cursor-pointer group',
                      selectedSection === section.id && !selectedLecture && 'bg-accent'
                    )}
                  >
                    <button
                      onClick={() => onToggleSection(section.id)}
                      className="p-0.5 hover:bg-muted rounded"
                    >
                      {expandedSections.has(section.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                    <div 
                      className="flex-1 min-w-0"
                      onClick={() => onSelectSection(section.id)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">Section {index + 1}</span>
                      </div>
                      <p className="text-sm font-medium truncate">{section.title}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSection(section.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {expandedSections.has(section.id) && (
                    <div className="ml-6 space-y-1 border-l-2 border-border pl-2">
                      {[...section.lectures]
                        .sort((a, b) => a.order - b.order)
                        .map((lecture, lectureIndex) => {
                        // Get the appropriate icon component
                        const getIcon = (type: string) => {
                          switch (type) {
                            case 'VIDEO': return Video;
                            case 'ARTICLE': return FileText;
                            case 'QUIZ': return HelpCircle;
                            case 'CODING_EXERCISE': return Code;
                            case 'ASSIGNMENT': return ClipboardList;
                            case 'PROJECT': return FolderKanban;
                            default: return FileText;
                          }
                        };
                        const Icon = getIcon(lecture.type);
                        
                        return (
                          <div
                            key={lecture.id}
                            className={cn(
                              'flex items-center gap-2 p-2 rounded-lg hover:bg-accent cursor-pointer group',
                              selectedLecture === lecture.id && 'bg-accent'
                            )}
                            onClick={() => onSelectLecture(section.id, lecture.id)}
                          >
                            <span className="text-xs text-muted-foreground font-medium w-5 shrink-0">
                              {lectureIndex + 1}
                            </span>
                            <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="text-sm flex-1 truncate">{lecture.title || 'Untitled Lecture'}</span>
                            {lecture.resources && lecture.resources.length > 0 && (
                              <Paperclip className="h-3 w-3 text-muted-foreground" />
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteLecture(section.id, lecture.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        );
                      })}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="w-full justify-start">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Lecture
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem onClick={() => onAddLecture(section.id, 'VIDEO')}>
                            <Video className="h-4 w-4 mr-2" />
                            Video
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onAddLecture(section.id, 'ARTICLE')}>
                            <FileText className="h-4 w-4 mr-2" />
                            Article
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onAddLecture(section.id, 'QUIZ')}>
                            <HelpCircle className="h-4 w-4 mr-2" />
                            Quiz
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onAddLecture(section.id, 'CODING_EXERCISE')}>
                            <Code className="h-4 w-4 mr-2" />
                            Coding Exercise
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onAddLecture(section.id, 'ASSIGNMENT')}>
                            <ClipboardList className="h-4 w-4 mr-2" />
                            Assignment
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onAddLecture(section.id, 'PROJECT')}>
                            <FolderKanban className="h-4 w-4 mr-2" />
                            Project
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onAddLecture(section.id, 'RESOURCE')}>
                            <Paperclip className="h-4 w-4 mr-2" />
                            Resource
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              ))}
              
              <Button onClick={onAddSection} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
