
import { create } from 'zustand';
import { Notification } from '@/generated/prisma';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  markAsRead: (notificationId: string) => void;
  fetchNotifications: () => Promise<void>;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) => {
    const unreadCount = notifications.filter(n => !n.read).length;
    set({ notifications, unreadCount });
  },

  markAsRead: async (notificationId) => {
    // Optimistically update UI
    set(state => {
      const updatedNotifications = state.notifications.map(n =>
        n.id === notificationId ? { ...n, read: true, readAt: new Date() } : n
      );
      const unreadCount = updatedNotifications.filter(n => !n.read).length;
      return { notifications: updatedNotifications, unreadCount };
    });

    // Call API to persist change
    try {
      await fetch(`/api/notifications/${notificationId}/mark-read`, {
        method: 'PUT',
      });
    } catch (error) {
      console.error("Failed to mark notification as read on server", error);
      // Optionally, revert optimistic update or show error to user
    }
  },

  fetchNotifications: async () => {
    try {
      const response = await fetch('/api/notifications');
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data: Notification[] = await response.json();
      get().setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  },

  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
}));
