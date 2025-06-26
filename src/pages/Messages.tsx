
import { useMessages } from '@/presentation/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessagesHeader } from '@/components/messages/MessagesHeader';
import { MessagesList } from '@/components/messages/MessagesList';

const Messages = () => {
  const { user } = useAuth();
  const { messages, unreadCount, markAsRead } = useMessages();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <MessagesHeader unreadCount={unreadCount} />

        <Card>
          <CardHeader>
            <CardTitle>All Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <MessagesList
              messages={messages}
              currentUserId={user?.id}
              onMarkAsRead={markAsRead}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Messages;
