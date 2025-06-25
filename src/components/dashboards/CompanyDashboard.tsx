
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Calendar, MapPin, Users, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  status: string;
  jobs: Array<{
    id: string;
    title: string;
    positions_available: number;
    positions_filled: number;
    status: string;
  }>;
}

const CompanyDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyData();
  }, [profile]);

  const fetchCompanyData = async () => {
    if (!profile?.id) return;

    try {
      // First get the company
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('owner_id', profile.id)
        .single();

      if (companyError && companyError.code !== 'PGRST116') {
        throw companyError;
      }

      setCompany(companyData);

      if (companyData) {
        // Then get events with jobs
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select(`
            *,
            jobs (
              id,
              title,
              positions_available,
              positions_filled,
              status
            )
          `)
          .eq('company_id', companyData.id)
          .order('start_date', { ascending: false });

        if (eventsError) throw eventsError;
        setEvents(eventsData || []);
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'published': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
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

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to EventStaff Pro</h1>
            <p className="text-gray-600 mb-8">You need to set up your company profile first.</p>
            <Button onClick={() => navigate('/company/setup')}>
              Set Up Company Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
              <p className="text-gray-600">Manage your events and staff</p>
            </div>
            <Button onClick={() => navigate('/events/create')} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Event
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Events</p>
                  <p className="text-3xl font-bold">{events.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Events</p>
                  <p className="text-3xl font-bold">
                    {events.filter(e => e.status === 'active').length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Jobs</p>
                  <p className="text-3xl font-bold">
                    {events.reduce((acc, event) => acc + event.jobs.length, 0)}
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
                  <p className="text-sm text-gray-600">Open Positions</p>
                  <p className="text-3xl font-bold">
                    {events.reduce((acc, event) => 
                      acc + event.jobs.reduce((jobAcc, job) => 
                        jobAcc + (job.positions_available - job.positions_filled), 0), 0)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events List */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Events</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription className="flex items-center mt-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        {event.location}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                    </div>
                    
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Jobs ({event.jobs.length})</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/events/${event.id}`)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </Button>
                      </div>
                      
                      {event.jobs.length > 0 ? (
                        <div className="space-y-1">
                          {event.jobs.slice(0, 2).map((job) => (
                            <div key={job.id} className="flex justify-between text-sm">
                              <span className="text-gray-700">{job.title}</span>
                              <span className="text-gray-500">
                                {job.positions_filled}/{job.positions_available} filled
                              </span>
                            </div>
                          ))}
                          {event.jobs.length > 2 && (
                            <div className="text-sm text-gray-500">
                              +{event.jobs.length - 2} more jobs
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No jobs created yet</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
            <p className="text-gray-600 mb-4">Create your first event to get started</p>
            <Button onClick={() => navigate('/events/create')}>
              Create Your First Event
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;
