
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Notification } from '@/domain/entities/Notification';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

export const NotificationItem = ({ notification, onMarkAsRead }: NotificationItemProps) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationBgColor = (type: string, isRead: boolean) => {
    const baseColor = isRead ? 'bg-gray-50' : 'bg-white border-l-4';
    switch (type) {
      case 'success': return isRead ? baseColor : `${baseColor} border-green-500`;
      case 'warning': return isRead ? baseColor : `${baseColor} border-yellow-500`;
      case 'error': return isRead ? baseColor : `${baseColor} border-red-500`;
      default: return isRead ? baseColor : `${baseColor} border-blue-500`;
    }
  };

  return (
    <div
      className={`p-4 rounded-lg transition-colors ${getNotificationBgColor(notification.type, notification.isRead)}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          {getNotificationIcon(notification.type)}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className={`font-medium ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                {notification.title}
              </h3>
              {!notification.isRead && (
                <Badge variant="default" className="text-xs">New</Badge>
              )}
            </div>
            <p className={`mt-1 ${notification.isRead ? 'text-gray-500' : 'text-gray-600'}`}>
              {notification.message}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')}
            </p>
          </div>
        </div>
        {!notification.isRead && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMarkAsRead(notification.id)}
            className="ml-4"
          >
            <Check className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
