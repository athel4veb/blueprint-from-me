
import { useState } from 'react';
import { useEvents } from '@/presentation/hooks/useEvents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Plus, MapPin, Clock, Building } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { CreateEventDialog } from '@/components/calendar/CreateEventDialog';

const Calendar = () => {
  const { user, userType } = useAuth();
  const { events, companyEvents } = useEvents();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const displayEvents = userType === 'company' ? companyEvents : events;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingEvents = displayEvents.filter(event => 
    new Date(event.startDate) >= new Date()
  ).slice(0, 5);

  const todaysEvents = displayEvents.filter(event => {
    const eventDate = new Date(event.startDate);
    const today = new Date();
    return eventDate.toDateString() === today.toDateString();
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Calendar</h1>
              <p className="text-gray-600">
                {userType === 'company' ? 'Manage your company events' : 'View upcoming events'}
              </p>
            </div>
            {userType === 'company' && (
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Today's Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todaysEvents.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No events today</p>
              ) : (
                <div className="space-y-3">
                  {todaysEvents.map((event) => (
                    <div key={event.id} className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{event.title}</h3>
                        <Badge className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {format(new Date(event.startDate), 'HH:mm')} - {format(new Date(event.endDate), 'HH:mm')}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {event.location}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No upcoming events</p>
              ) : (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
                          <p className="text-gray-600 text-sm">{event.description}</p>
                        </div>
                        <Badge className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          <div>
                            <p>{format(new Date(event.startDate), 'MMM dd, yyyy')}</p>
                            <p className="text-xs">{format(new Date(event.startDate), 'HH:mm')} - {format(new Date(event.endDate), 'HH:mm')}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{event.location}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2" />
                          <span>Company Event</span>
                        </div>
                      </div>

                      {userType === 'company' && (
                        <div className="mt-4 flex space-x-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">View Jobs</Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* All Events List */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>All Events</CardTitle>
          </CardHeader>
          <CardContent>
            {displayEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No events available</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Event</th>
                      <th className="text-left py-2">Date</th>
                      <th className="text-left py-2">Location</th>
                      <th className="text-left py-2">Status</th>
                      {userType === 'company' && <th className="text-left py-2">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {displayEvents.map((event) => (
                      <tr key={event.id} className="border-b hover:bg-gray-50">
                        <td className="py-3">
                          <div>
                            <p className="font-medium">{event.title}</p>
                            <p className="text-sm text-gray-600">{event.description}</p>
                          </div>
                        </td>
                        <td className="py-3">
                          <div>
                            <p>{format(new Date(event.startDate), 'MMM dd, yyyy')}</p>
                            <p className="text-sm text-gray-600">
                              {format(new Date(event.startDate), 'HH:mm')} - {format(new Date(event.endDate), 'HH:mm')}
                            </p>
                          </div>
                        </td>
                        <td className="py-3">{event.location}</td>
                        <td className="py-3">
                          <Badge className={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                        </td>
                        {userType === 'company' && (
                          <td className="py-3">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">Edit</Button>
                              <Button variant="outline" size="sm">Delete</Button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Event Dialog */}
        <CreateEventDialog 
          open={showCreateDialog} 
          onOpenChange={setShowCreateDialog}
        />
      </div>
    </div>
  );
};

export default Calendar;
