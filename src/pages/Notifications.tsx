
import { useNotifications } from '@/presentation/hooks/useNotifications';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NotificationsHeader } from '@/components/notifications/NotificationsHeader';
import { NotificationsList } from '@/components/notifications/NotificationsList';
import { Bell } from 'lucide-react';

const Notifications = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const unreadNotifications = notifications.filter(n => !n.isRead);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <NotificationsHeader 
          unreadCount={unreadCount} 
          onMarkAllAsRead={markAllAsRead} 
        />

        {/* Unread Notifications */}
        {unreadNotifications.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Unread Notifications ({unreadNotifications.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <NotificationsList 
                notifications={unreadNotifications} 
                onMarkAsRead={markAsRead} 
              />
            </CardContent>
          </Card>
        )}

        {/* All Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>All Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <NotificationsList 
              notifications={notifications} 
              onMarkAsRead={markAsRead} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;
