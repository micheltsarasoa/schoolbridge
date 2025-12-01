"use client"

import { useState } from "react"
import { ChevronDown, Play, Download, Share2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import courseData from "@/data/course-sections.json"

interface Lesson {
  title: string
  duration: string
}

interface Section {
  id: string
  title: string
  duration: string
  lessons?: Lesson[]
  defaultOpen?: boolean
}

const courseSections: Section[] = courseData.sections

export function CourseContentSidebar() {
  const [openSections, setOpenSections] = useState<string[]>(["01"])

  return (
    <div className="w-80 border-l border-border bg-white">
      <ScrollArea className="h-full">
        <div className="px-6 py-6">
          {/* Header Actions */}
          <div className="mb-6 flex items-center justify-between gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <Download className="h-4 w-4" />
              Enroll Now
            </Button>
          </div>

          {/* Course Content */}
          <div className="mb-8">
            <h3 className="mb-4 font-semibold text-foreground">Course content</h3>
            <div className="space-y-2">
              {courseSections.map((section) => (
                <Collapsible
                  key={section.id}
                  open={openSections.includes(section.id)}
                  onOpenChange={(open) => {
                    setOpenSections(prev =>
                      open ? [...prev, section.id] : prev.filter(s => s !== section.id)
                    )
                  }}
                >
                  <Card className="border border-border leading-normal">
                    <CollapsibleTrigger asChild>
                      <button className="flex w-full items-center justify-between px-4 py-2 text-left hover:bg-muted/50 transition-colors">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-foreground">
                            {section.id}: {section.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs font-normal">
                            {section.duration}
                          </Badge>
                          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${
                            openSections.includes(section.id) ? 'rotate-180' : ''
                          }`} />
                        </div>
                      </button>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      {section.lessons && (
                        <div className="border-t border-border bg-muted/30">
                          {section.lessons.map((lesson, idx) => (
                            <button
                              key={idx}
                              className="flex w-full items-center justify-between px-4 py-2 hover:bg-muted/50 transition-colors text-left"
                            >
                              <div className="flex items-center gap-2">
                                <Play className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-sm text-foreground">{lesson.title}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}
            </div>
          </div>

          {/* Author */}
          <div>
            <Separator className="mb-6" />
            <h3 className="mb-4 font-semibold text-foreground">Author</h3>
            <Card className="border-0 shadow-none p-0">
              <CardContent className="p-0">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Crystal Lucas" />
                    <AvatarFallback>CL</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-foreground">Crystal Lucas</span>
                      <Badge variant="secondary" className="h-4 w-4 rounded-full p-0 bg-blue-500">
                        <svg
                          className="h-3 w-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">UI/UX Specialist</p>
                    <div className="mt-1 flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sm font-medium text-foreground">(4.8)</span>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                  Crystal is a seasoned UI/UX designer with over a
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
