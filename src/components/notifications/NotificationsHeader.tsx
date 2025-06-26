
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCheck } from 'lucide-react';

interface NotificationsHeaderProps {
  unreadCount: number;
  onMarkAllAsRead: () => void;
}

export const NotificationsHeader = ({ unreadCount, onMarkAllAsRead }: NotificationsHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
          <p className="text-gray-600">Stay updated with your latest activities</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {unreadCount} unread
          </Badge>
          {unreadCount > 0 && (
            <Button onClick={onMarkAllAsRead} variant="outline">
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
