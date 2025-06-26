
import { useState } from 'react';
import { useEvents } from '@/presentation/hooks/useEvents';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { CreateEventDialog } from '@/components/calendar/CreateEventDialog';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { EventGrid } from '@/components/calendar/EventGrid';
import { useToast } from '@/hooks/use-toast';

const Calendar = () => {
  const { user, userType } = useAuth();
  const { events, deleteEvent } = useEvents();
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId);
    toast({
      title: "Success",
      description: "Event deleted successfully"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <CalendarHeader 
          userType={userType}
          onCreateEvent={() => setShowCreateDialog(true)}
        />

        <Card>
          <CardContent className="p-6">
            <EventGrid
              events={events}
              userType={userType}
              currentUserId={user?.id}
              onDeleteEvent={handleDeleteEvent}
            />
          </CardContent>
        </Card>

        <CreateEventDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />
      </div>
    </div>
  );
};

export default Calendar;
