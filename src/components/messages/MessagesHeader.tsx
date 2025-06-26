
import { Badge } from '@/components/ui/badge';

interface MessagesHeaderProps {
  unreadCount: number;
}

export const MessagesHeader = ({ unreadCount }: MessagesHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Communicate with companies and promoters</p>
        </div>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {unreadCount} unread
        </Badge>
      </div>
    </div>
  );
};
