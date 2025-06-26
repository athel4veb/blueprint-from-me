
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ConversationItemProps {
  conversation: any;
  isSelected: boolean;
  onClick: () => void;
}

export const ConversationItem = ({ conversation, isSelected, onClick }: ConversationItemProps) => {
  const initials = conversation.senderName?.split(' ').map((n: string) => n[0]).join('') || 'U';
  
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        isSelected && "ring-2 ring-primary bg-primary/5"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900 truncate">
                {conversation.senderName || 'Unknown User'}
              </p>
              {conversation.unreadCount > 0 && (
                <Badge variant="default" className="ml-2 text-xs">
                  {conversation.unreadCount}
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-gray-500 truncate mt-1">
              {conversation.subject || 'No subject'}
            </p>
            
            <p className="text-xs text-gray-400 mt-1">
              {new Date(conversation.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
