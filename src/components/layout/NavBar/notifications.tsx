'use client';

import { useState, useEffect } from 'react';
import { Bell, X, CheckCircle2, Clock, AlertCircle, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'announcement' | 'assignment' | 'quiz' | 'grade' | 'message';
  timestamp: string;
  isRead: boolean;
  link?: string;
};

const notificationIcons = {
  announcement: <AlertCircle className="h-4 w-4 text-blue-500" />,
  assignment: <BookOpen className="h-4 w-4 text-orange-500" />,
  quiz: <Clock className="h-4 w-4 text-purple-500" />,
  grade: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  message: <Bell className="h-4 w-4 text-indigo-500" />,
};

const notificationLabels = {
  announcement: 'Announcement',
  assignment: 'Assignment',
  quiz: 'Quiz',
  grade: 'Grade',
  message: 'Message',
};

// Mock notification data - replace with API call
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Assignment Posted',
    message: 'Mathematics assignment for Chapter 5 is now available',
    type: 'assignment',
    timestamp: '2 hours ago',
    isRead: false,
    link: '/student/assignments',
  },
  {
    id: '2',
    title: 'Quiz Results Available',
    message: 'You scored 92% on the Physics quiz',
    type: 'grade',
    timestamp: '5 hours ago',
    isRead: false,
    link: '/student/quizzes',
  },
  {
    id: '3',
    title: 'Class Announcement',
    message: 'Next week\'s class schedule has been updated',
    type: 'announcement',
    timestamp: '1 day ago',
    isRead: true,
    link: '/student/courses',
  },
  {
    id: '4',
    title: 'New Quiz Available',
    message: 'Science quiz on Photosynthesis is now available',
    type: 'quiz',
    timestamp: '2 days ago',
    isRead: true,
    link: '/student/quizzes',
  },
];

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [open, setOpen] = useState(false);

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      window.location.href = notification.link;
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-lg relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white font-semibold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex flex-col h-96">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <div>
              <h2 className="font-semibold text-lg">Notifications</h2>
              {unreadCount > 0 && (
                <p className="text-xs text-muted-foreground">
                  {unreadCount} unread
                </p>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={markAllAsRead}
              >
                Mark all as read
              </Button>
            )}
          </div>

          {/* Notifications List */}
          <ScrollArea className="flex-1">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                <Bell className="h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">
                  No notifications
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 cursor-pointer transition-colors ${
                      !notification.isRead
                        ? 'bg-muted/50 hover:bg-muted'
                        : 'hover:bg-muted/30'
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className="mt-1">
                        {notificationIcons[notification.type]}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-sm line-clamp-1">
                              {notification.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                          </div>
                          {!notification.isRead && (
                            <div className="h-2 w-2 rounded-full bg-blue-500 mt-1 shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <Badge
                            variant="secondary"
                            className="text-xs"
                          >
                            {notificationLabels[notification.type]}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {notification.timestamp}
                          </span>
                        </div>
                      </div>

                      {/* Close Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearNotification(notification.id);
                        }}
                        className="text-muted-foreground hover:text-foreground mt-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t p-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => {
                  window.location.href = '/notifications';
                  setOpen(false);
                }}
              >
                View All Notifications
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
