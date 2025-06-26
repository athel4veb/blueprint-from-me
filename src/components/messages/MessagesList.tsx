
import { Message } from '@/domain/entities/Message';
import { MessageItem } from './MessageItem';
import { MessageSquare } from 'lucide-react';

interface MessagesListProps {
  messages: Message[];
  currentUserId?: string;
  onMarkAsRead: (messageId: string) => void;
}

export const MessagesList = ({ messages, currentUserId, onMarkAsRead }: MessagesListProps) => {
  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
        <p className="text-gray-600">Messages will appear here when you receive them</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          currentUserId={currentUserId}
          onMarkAsRead={onMarkAsRead}
        />
      ))}
    </div>
  );
};
