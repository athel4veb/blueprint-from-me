
import { Message } from '@/domain/entities/Message';
import { ConversationItem } from './ConversationItem';
import { MessageSquare } from 'lucide-react';
import { useMemo } from 'react';

interface ConversationListProps {
  messages: Message[];
  currentUserId?: string;
  onSelectConversation: (otherUserId: string) => void;
  selectedConversation?: string;
}

export const ConversationList = ({ 
  messages, 
  currentUserId, 
  onSelectConversation,
  selectedConversation 
}: ConversationListProps) => {
  const conversations = useMemo(() => {
    const conversationMap = new Map();
    
    messages.forEach(message => {
      const otherUserId = message.senderId === currentUserId 
        ? message.recipientId 
        : message.senderId;
      
      if (!conversationMap.has(otherUserId) || 
          new Date(message.createdAt) > new Date(conversationMap.get(otherUserId).createdAt)) {
        conversationMap.set(otherUserId, {
          ...message,
          otherUserId,
          unreadCount: messages.filter(m => 
            m.senderId === otherUserId && 
            m.recipientId === currentUserId && 
            !m.isRead
          ).length
        });
      }
    });
    
    return Array.from(conversationMap.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [messages, currentUserId]);

  if (conversations.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
        <p className="text-gray-600">Start a conversation to see it here</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.otherUserId}
          conversation={conversation}
          isSelected={selectedConversation === conversation.otherUserId}
          onClick={() => onSelectConversation(conversation.otherUserId)}
        />
      ))}
    </div>
  );
};
