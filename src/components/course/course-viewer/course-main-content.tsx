"use client"

import { useState } from "react"
import { Play, Clock, Star } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Check } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { AspectRatio } from "@/components/ui/aspect-ratio"

const learningPoints = [
  "Setting up the environment",
  "Advanced HTML Practices",
  "Build a portfolio website",
  "Responsive Designs",
  "Understand HTML Programming",
  "Code HTML",
  "Start building beautiful websites",
]

export function CourseMainContent() {
  return (
    <ScrollArea className="flex-1 bg-background">
      <div className="px-8 py-6">
        {/* Course Title and Info */}
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <span>Figma from A to Z</span>
            <span className="text-muted-foreground/50">/</span>
            <span>UI/UX Design</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">
            Figma from A to Z
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Badge variant="secondary" className="gap-1.5 font-normal">
              <Play className="h-3.5 w-3.5" />
              <span>38 lessons</span>
            </Badge>
            <Badge variant="secondary" className="gap-1.5 font-normal">
              <Clock className="h-3.5 w-3.5" />
              <span>4h 30mins</span>
            </Badge>
            <Badge variant="secondary" className="gap-1.5 font-normal">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span>4.5 (126 reviews)</span>
            </Badge>
          </div>
        </div>

        {/* Video Player */}
        <Card className="mb-6 overflow-hidden border-0 shadow-sm">
          <AspectRatio ratio={16 / 9}>
            <div className="relative h-full w-full bg-gradient-to-br from-amber-100 to-amber-50">
              <img
                src="/images/sddefault.jpg"
                alt="Course instructor"
                className="h-full w-full object-cover"
              />
              <Button
                size="icon"
                className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white"
              >
                <Play className="h-8 w-8 fill-primary text-primary ml-1" />
              </Button>
            </div>
          </AspectRatio>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="mb-6">
          <TabsList className="h-auto bg-transparent border-b border-border rounded-none w-full justify-start p-0">
            <TabsTrigger 
              value="overview" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="author"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Author
            </TabsTrigger>
            <TabsTrigger 
              value="faq"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              FAQ
            </TabsTrigger>
            <TabsTrigger 
              value="announcements"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Announcements
            </TabsTrigger>
            <TabsTrigger 
              value="reviews"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-8">
            {/* About Course */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-foreground">
                About Course
              </h2>
              <p className="mb-3 text-sm leading-relaxed text-foreground/80">
                Unlock the power of Figma, the leading collaborative design tool, with our comprehensive online course.
                Whether you're a novice or looking to enhance your skills, this course will guide you through Figma's robust
                features and workflows.
              </p>
              <p className="text-sm leading-relaxed text-foreground/80">
                Perfect for UI/UX designers, product managers, and anyone interested in modern design tools. Join us to elevate
                your design skills and boost your productivity with Figma!
              </p>
            </div>

            {/* What You'll Learn */}
            <div>
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                What You'll Learn
              </h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {learningPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
                    <span className="text-sm text-foreground/80">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="author" className="mt-6">
            <p className="text-sm text-muted-foreground">Author information...</p>
          </TabsContent>

          <TabsContent value="faq" className="mt-6">
            <p className="text-sm text-muted-foreground">Frequently asked questions...</p>
          </TabsContent>

          <TabsContent value="announcements" className="mt-6">
            <p className="text-sm text-muted-foreground">Course announcements...</p>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <p className="text-sm text-muted-foreground">Student reviews...</p>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  )
}
