
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, MapPin, Users, ClipboardCheck, AlertTriangle } from 'lucide-react';

interface Assignment {
  id: string;
  event_title: string;
  event_location: string;
  start_date: string;
  end_date: string;
  status: string;
  promoters_count: number;
  company_name: string;
}

const SupervisorDashboard = () => {
  const { profile } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [activeEvents, setActiveEvents] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, [profile]);

  const fetchAssignments = async () => {
    // For now, we'll show sample data since supervisor assignments
    // aren't fully implemented yet in the database schema
    const sampleAssignments: Assignment[] = [
      {
        id: '1',
        event_title: 'Tech Conference 2024',
        event_location: 'San Francisco, CA',
        start_date: '2024-03-15T09:00:00',
        end_date: '2024-03-17T18:00:00',
        status: 'active',
        promoters_count: 8,
        company_name: 'EventCorp'
      },
      {
        id: '2',
        event_title: 'Music Festival',
        event_location: 'Los Angeles, CA',
        start_date: '2024-04-20T14:00:00',
        end_date: '2024-04-22T23:00:00',
        status: 'upcoming',
        promoters_count: 12,
        company_name: 'PromoMax'
      }
    ];

    setAssignments(sampleAssignments);
    setActiveEvents(sampleAssignments.filter(a => a.status === 'active'));
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Supervisor Dashboard</h1>
          <p className="text-gray-600">Welcome back, {profile?.full_name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Events</p>
                  <p className="text-3xl font-bold">{activeEvents.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Assignments</p>
                  <p className="text-3xl font-bold">{assignments.length}</p>
                </div>
                <ClipboardCheck className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Promoters Managed</p>
                  <p className="text-3xl font-bold">
                    {assignments.reduce((acc, a) => acc + a.promoters_count, 0)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Issues</p>
                  <p className="text-3xl font-bold">0</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Events */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Active Supervisions</h2>
            <div className="space-y-4">
              {activeEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{event.event_title}</CardTitle>
                        <CardDescription>{event.company_name}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.event_location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        Managing {event.promoters_count} promoters
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" className="flex-1">
                          View Team
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          Submit Report
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* All Assignments */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">All Assignments</h2>
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{assignment.event_title}</CardTitle>
                        <CardDescription>{assignment.company_name}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(assignment.status)}>
                        {assignment.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {assignment.event_location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        {assignment.promoters_count} promoters
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(assignment.start_date).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;
