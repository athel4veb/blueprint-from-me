
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/infrastructure/di/Container';
import { Message } from '@/domain/entities/Message';
import { useAuth } from '@/contexts/AuthContext';

export const useMessages = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const messagesQuery = useQuery({
    queryKey: ['messages', user?.id],
    queryFn: () => container.messageService.getMessagesByUser(user?.id || ''),
    enabled: !!user?.id
  });

  const unreadCountQuery = useQuery({
    queryKey: ['messages', 'unread-count', user?.id],
    queryFn: () => container.messageService.getUnreadCount(user?.id || ''),
    enabled: !!user?.id
  });

  const sendMessageMutation = useMutation({
    mutationFn: (message: Omit<Message, 'id' | 'createdAt' | 'updatedAt'>) =>
      container.messageService.sendMessage(message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    }
  });

  const markAsReadMutation = useMutation({
    mutationFn: (messageId: string) => container.messageService.markAsRead(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    }
  });

  return {
    messages: messagesQuery.data || [],
    unreadCount: unreadCountQuery.data || 0,
    isLoading: messagesQuery.isLoading,
    sendMessage: sendMessageMutation.mutate,
    markAsRead: markAsReadMutation.mutate,
    isSending: sendMessageMutation.isPending
  };
};

export const useConversation = (otherUserId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['conversation', user?.id, otherUserId],
    queryFn: () => container.messageService.getConversation(user?.id || '', otherUserId),
    enabled: !!user?.id && !!otherUserId
  });
};
