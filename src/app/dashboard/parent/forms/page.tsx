'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const formsData = {
  pending: [
    { title: 'Field Trip Consent Form', type: 'Permission Slip', dueDate: 'Nov 10, 2025', status: 'Pending' },
  ],
  submitted: [
    { title: 'Medical Information Update', type: 'Medical', submittedDate: 'Oct 15, 2025', status: 'Submitted' },
  ],
};

export default function ParentFormsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Forms & Permissions</h1>
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="submitted">Submitted</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {formsData.pending.map((form, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{form.title}</CardTitle>
                    <Badge>{form.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Type: {form.type}</p>
                  <p className="text-sm text-muted-foreground">Due: {form.dueDate}</p>
                  <div className="mt-4 flex justify-end">
                    <Button>Complete Form</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="submitted">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {formsData.submitted.map((form, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{form.title}</CardTitle>
                    <Badge variant="secondary">{form.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Type: {form.type}</p>
                  <p className="text-sm text-muted-foreground">Submitted: {form.submittedDate}</p>
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline">View Submitted</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="all">
          <p>All forms will be displayed here.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
