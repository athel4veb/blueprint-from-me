
import { useState, useMemo } from 'react';
import { useEvents } from '@/presentation/hooks/useEvents';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { CreateEventDialog } from '@/components/calendar/CreateEventDialog';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { EventGrid } from '@/components/calendar/EventGrid';
import { EventFilters } from '@/components/calendar/EventFilters';
import { useToast } from '@/hooks/use-toast';

const Calendar = () => {
  const { user, userType } = useAuth();
  const { events, deleteEvent } = useEvents();
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = !searchTerm || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !statusFilter || event.status === statusFilter;

      const matchesDate = !dateFilter || (() => {
        const eventDate = new Date(event.startDate);
        const now = new Date();
        
        switch (dateFilter) {
          case 'today':
            return eventDate.toDateString() === now.toDateString();
          case 'week':
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            return eventDate >= weekStart && eventDate <= weekEnd;
          case 'month':
            return eventDate.getMonth() === now.getMonth() && 
                   eventDate.getFullYear() === now.getFullYear();
          case 'upcoming':
            return eventDate > now;
          default:
            return true;
        }
      })();

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [events, searchTerm, statusFilter, dateFilter]);

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId);
    toast({
      title: "Success",
      description: "Event deleted successfully"
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setDateFilter('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <CalendarHeader 
          userType={userType}
          onCreateEvent={() => setShowCreateDialog(true)}
        />

        <EventFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          dateFilter={dateFilter}
          onDateChange={setDateFilter}
          onClearFilters={clearFilters}
        />

        <Card>
          <CardContent className="p-6">
            <EventGrid
              events={filteredEvents}
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
