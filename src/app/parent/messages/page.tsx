'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const messagesData = {
  inbox: [
    { id: 1, teacher: 'Mr. Jean-Luc', subject: 'Regarding Student A\'s progress', preview: 'Student A is doing well...', date: 'Oct 29', unread: true, avatar: '/placeholder.svg?height=32&width=32' },
  ],
  sent: [],
  archived: [],
};

export default function ParentMessagesPage() {
  const [selectedMessage, setSelectedMessage] = useState(messagesData.inbox[0]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="inbox">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="inbox">Inbox</TabsTrigger>
                <TabsTrigger value="sent">Sent</TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
              </TabsList>
              <TabsContent value="inbox">
                <ul className="space-y-2 mt-4">
                  {messagesData.inbox.map(message => (
                    <li key={message.id} onClick={() => setSelectedMessage(message)} className="p-2 rounded-md cursor-pointer hover:bg-muted">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={message.avatar} alt={message.teacher} />
                          <AvatarFallback>{message.teacher.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{message.teacher}</p>
                          <p className="text-sm text-muted-foreground truncate">{message.subject}</p>
                        </div>
                        {message.unread && <div className="h-2 w-2 rounded-full bg-primary ml-auto" />}
                      </div>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        {selectedMessage ? (
          <Card>
            <CardHeader>
              <CardTitle>{selectedMessage.subject}</CardTitle>
              <CardDescription>From: {selectedMessage.teacher} | {selectedMessage.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Full message content goes here...</p>
              <div className="mt-6">
                <Textarea placeholder="Reply to the message..." />
                <Button className="mt-2">Send Reply</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Select a message to read</p>
          </div>
        )}
      </div>
    </div>
  );
}
