
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/infrastructure/di/Container';
import { Event } from '@/domain/entities/Event';
import { useAuth } from '@/contexts/AuthContext';

export const useEvents = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const eventsQuery = useQuery({
    queryKey: ['events'],
    queryFn: () => container.eventService.getAllEvents(),
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  const companyEventsQuery = useQuery({
    queryKey: ['events', 'company', user?.id],
    queryFn: () => container.eventService.getEventsByCompany(user?.id || ''),
    enabled: !!user?.id,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const createEventMutation = useMutation({
    mutationFn: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) =>
      container.eventService.createEvent(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error) => {
      console.error('Failed to create event:', error);
    }
  });

  const updateEventMutation = useMutation({
    mutationFn: ({ id, event }: { id: string; event: Partial<Event> }) =>
      container.eventService.updateEvent(id, event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }
  });

  const deleteEventMutation = useMutation({
    mutationFn: (id: string) => container.eventService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }
  });

  return {
    events: eventsQuery.data || [],
    companyEvents: companyEventsQuery.data || [],
    isLoading: eventsQuery.isLoading,
    createEvent: createEventMutation.mutate,
    updateEvent: updateEventMutation.mutate,
    deleteEvent: deleteEventMutation.mutate,
    isCreating: createEventMutation.isPending
  };
};
