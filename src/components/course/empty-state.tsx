'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

interface EmptyStateProps {
  onAddSection: () => void;
}

export function EmptyState({ onAddSection }: EmptyStateProps) {
  return (
    <Card className="p-12">
      <div className="text-center max-w-md mx-auto">
        <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
        <h2 className="text-2xl font-bold mb-2">Start Building Your Course</h2>
        <p className="text-muted-foreground mb-6">
          Create sections to organize your course content. Each section can contain multiple lectures of different types.
        </p>
        <Button onClick={onAddSection} size="lg">
          Create First Section
        </Button>
      </div>
    </Card>
  );
}
