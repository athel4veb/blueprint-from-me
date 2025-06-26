
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Clock, Edit, Trash2 } from 'lucide-react';
import { Event } from '@/domain/entities/Event';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
  isCompanyOwned?: boolean;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
}

export const EventCard = ({ event, isCompanyOwned = false, onEdit, onDelete }: EventCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{event.title}</CardTitle>
          <Badge className={getStatusColor(event.status)} variant="secondary">
            {event.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {event.description && (
          <p className="text-gray-600 text-sm">{event.description}</p>
        )}
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-500">
            <MapPin className="h-4 w-4 mr-2" />
            {event.location}
          </div>
          <div className="flex items-center text-gray-500">
            <CalendarDays className="h-4 w-4 mr-2" />
            {format(new Date(event.startDate), 'MMM dd, yyyy')}
          </div>
          <div className="flex items-center text-gray-500">
            <Clock className="h-4 w-4 mr-2" />
            {format(new Date(event.startDate), 'HH:mm')} - {format(new Date(event.endDate), 'HH:mm')}
          </div>
        </div>

        {isCompanyOwned && (
          <div className="flex space-x-2 pt-3 border-t">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit?.(event)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDelete?.(event.id)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
