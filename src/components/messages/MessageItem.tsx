
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Eye } from 'lucide-react';
import { Message } from '@/domain/entities/Message';

interface MessageItemProps {
  message: Message;
  currentUserId?: string;
  onMarkAsRead: (messageId: string) => void;
}

export const MessageItem = ({ message, currentUserId, onMarkAsRead }: MessageItemProps) => {
  const isReceived = message.recipientId === currentUserId;
  const isUnread = !message.isRead && isReceived;

  return (
    <Card className={`transition-colors ${isUnread ? 'border-blue-500 bg-blue-50' : 'hover:shadow-md'}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <MessageSquare className="h-4 w-4 text-gray-500" />
              {message.subject && (
                <h3 className="font-medium text-gray-900">{message.subject}</h3>
              )}
              {isUnread && <Badge variant="default" className="text-xs">New</Badge>}
            </div>
            
            <p className="text-gray-600 text-sm mb-3">{message.content}</p>
            
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>
                {isReceived ? 'From' : 'To'}: {isReceived ? message.senderId : message.recipientId}
              </span>
              <span>{format(new Date(message.createdAt), 'MMM dd, yyyy HH:mm')}</span>
            </div>
          </div>
          
          {isUnread && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkAsRead(message.id)}
              className="ml-4"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
