
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, MapPin, Clock, DollarSign, Users } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  positions_available: number;
  positions_filled: number;
  hourly_rate: number;
  shift_start: string;
  shift_end: string;
  status: string;
  events: {
    title: string;
    location: string;
    start_date: string;
    end_date: string;
    companies: {
      name: string;
    };
  };
}

const PromoterDashboard = () => {
  const { profile } = useAuth();
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
    fetchMyApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          events (
            title,
            location,
            start_date,
            end_date,
            companies (
              name
            )
          )
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAvailableJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    if (!profile?.id) return;

    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          jobs (
            title,
            hourly_rate,
            events (
              title,
              start_date,
              location
            )
          )
        `)
        .eq('promoter_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const applyForJob = async (jobId: string) => {
    if (!profile?.id) return;

    try {
      const { error } = await supabase
        .from('job_applications')
        .insert({
          job_id: jobId,
          promoter_id: profile.id,
          status: 'pending'
        });

      if (error) throw error;
      
      // Refresh data
      await fetchJobs();
      await fetchMyApplications();
    } catch (error) {
      console.error('Error applying for job:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Promoter Dashboard</h1>
          <p className="text-gray-600">Welcome back, {profile?.full_name}!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Jobs */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Available Jobs</h2>
            <div className="space-y-4">
              {availableJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{job.title}</CardTitle>
                        <CardDescription>{job.events.companies.name}</CardDescription>
                      </div>
                      <Badge variant="secondary">
                        {job.positions_available - job.positions_filled} positions left
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {job.events.title}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {job.events.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        {job.shift_start} - {job.shift_end}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2" />
                        ${job.hourly_rate}/hour
                      </div>
                      <p className="text-sm text-gray-700">{job.description}</p>
                      <Button 
                        onClick={() => applyForJob(job.id)}
                        className="w-full"
                      >
                        Apply Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* My Applications */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">My Applications</h2>
            <div className="space-y-4">
              {myApplications.map((application) => (
                <Card key={application.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{application.jobs.title}</CardTitle>
                        <CardDescription>{application.jobs.events.title}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {application.jobs.events.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2" />
                        ${application.jobs.hourly_rate}/hour
                      </div>
                      <div className="text-sm text-gray-500">
                        Applied: {new Date(application.application_date).toLocaleDateString()}
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

export default PromoterDashboard;
