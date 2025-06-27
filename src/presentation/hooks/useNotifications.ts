import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/infrastructure/di/Container';
import { Notification } from '@/domain/entities/Notification';
import { useAuth } from '@/presentation/contexts/AuthContext';

export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => container.notificationService.getNotificationsByUser(user?.id || ''),
    enabled: !!user?.id
  });

  const unreadCountQuery = useQuery({
    queryKey: ['notifications', 'unread-count', user?.id],
    queryFn: () => container.notificationService.getUnreadCount(user?.id || ''),
    enabled: !!user?.id
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) => container.notificationService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => container.notificationService.markAllAsRead(user?.id || ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const createNotificationMutation = useMutation({
    mutationFn: (notification: Omit<Notification, 'id' | 'createdAt'>) =>
      container.notificationService.createNotification(notification),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  return {
    notifications: notificationsQuery.data || [],
    unreadCount: unreadCountQuery.data || 0,
    isLoading: notificationsQuery.isLoading,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    createNotification: createNotificationMutation.mutate
  };
};
