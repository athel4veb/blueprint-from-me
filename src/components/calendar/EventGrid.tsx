
import { Event } from '@/domain/entities/Event';
import { EventCard } from './EventCard';
import { Calendar } from 'lucide-react';

interface EventGridProps {
  events: Event[];
  userType?: string;
  currentUserId?: string;
  onEditEvent?: (event: Event) => void;
  onDeleteEvent?: (eventId: string) => void;
}

export const EventGrid = ({ 
  events, 
  userType, 
  currentUserId, 
  onEditEvent, 
  onDeleteEvent 
}: EventGridProps) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No events scheduled</h3>
        <p className="text-gray-600">Events will appear here when they are created</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          isCompanyOwned={userType === 'company' && event.companyId === currentUserId}
          onEdit={onEditEvent}
          onDelete={onDeleteEvent}
        />
      ))}
    </div>
  );
};
