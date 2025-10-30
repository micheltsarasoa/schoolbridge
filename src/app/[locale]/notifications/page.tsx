
'use client';

import { useEffect } from 'react';
import { useNotificationStore } from '@/stores/notificationStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, MailOpenIcon, MailIcon } from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, unreadCount, fetchNotifications, markAsRead } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  if (!notifications) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Notifications ({unreadCount} unread)</h1>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p className="text-center text-muted-foreground">No notifications yet.</p>
        ) : (
          notifications.map(notification => (
            <Card key={notification.id} className={notification.read ? "opacity-70" : "border-primary"}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{notification.title}</CardTitle>
                {!notification.read && (
                  <Button variant="ghost" size="icon" onClick={() => markAsRead(notification.id)} title="Mark as Read">
                    <MailOpenIcon className="h-5 w-5" />
                  </Button>
                )}
                {notification.read && (
                  <MailIcon className="h-5 w-5 text-muted-foreground" title="Read" />
                )}
              </CardHeader>
              <CardContent>
                <CardDescription>{notification.message}</CardDescription>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
                {notification.actionUrl && (
                  <a href={notification.actionUrl} className="text-sm text-blue-600 hover:underline mt-2 block">
                    View Details
                  </a>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
