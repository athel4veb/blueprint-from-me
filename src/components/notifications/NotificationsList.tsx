
import { Notification } from '@/domain/entities/Notification';
import { NotificationItem } from './NotificationItem';
import { Bell } from 'lucide-react';

interface NotificationsListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

export const NotificationsList = ({ notifications, onMarkAsRead }: NotificationsListProps) => {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
        <p className="text-gray-600">We'll notify you when something important happens</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
        />
      ))}
    </div>
  );
};
