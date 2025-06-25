
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Plus, Eye, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Job {
  id: string;
  title: string;
  description: string;
  positions_available: number;
  positions_filled: number;
  hourly_rate: number;
  status: string;
  events: {
    title: string;
    location: string;
    start_date: string;
    end_date: string;
  };
  _count?: {
    applications: number;
  };
}

interface Application {
  id: string;
  status: string;
  application_date: string;
  notes: string;
  jobs: {
    title: string;
    events: {
      title: string;
    };
  };
  profiles: {
    full_name: string;
    phone: string;
  };
}

const ManageJobs = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.user_type === 'company') {
      fetchJobs();
      fetchApplications();
    }
  }, [profile]);

  const fetchJobs = async () => {
    try {
      // Get jobs for events owned by this company
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          events (
            title,
            location,
            start_date,
            end_date,
            company_id,
            companies (
              owner_id
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter jobs for this company owner
      const userJobs = data?.filter(job => 
        job.events?.companies?.owner_id === profile?.id
      ) || [];

      setJobs(userJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: "Error",
        description: "Failed to load jobs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          jobs (
            title,
            events (
              title,
              companies (
                owner_id
              )
            )
          ),
          profiles (
            full_name,
            phone
          )
        `)
        .order('application_date', { ascending: false });

      if (error) throw error;

      // Filter applications for jobs owned by this company
      const userApplications = data?.filter(app => 
        app.jobs?.events?.companies?.owner_id === profile?.id
      ) || [];

      setApplications(userApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Application ${status} successfully`,
      });

      fetchApplications();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update application",
        variant: "destructive",
      });
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

  if (profile?.user_type !== 'company') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">This page is only available to company accounts.</p>
          <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Jobs</h1>
            <p className="text-gray-600">Create and manage your job postings</p>
          </div>
          <Button onClick={() => navigate('/create-job')}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Job
          </Button>
        </div>

        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="jobs">My Jobs ({jobs.length})</TabsTrigger>
            <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{job.title}</CardTitle>
                        <CardDescription>{job.events.title}</CardDescription>
                      </div>
                      <Badge variant={job.status === 'open' ? 'default' : 'secondary'}>
                        {job.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {job.events.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(job.events.start_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        {job.positions_filled}/{job.positions_available} filled
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">{job.description}</p>
                      <div className="flex gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => navigate(`/jobs/${job.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => navigate(`/edit-job/${job.id}`)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {jobs.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs created yet</h3>
                <p className="text-gray-600 mb-4">Create your first job posting to get started</p>
                <Button onClick={() => navigate('/create-job')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Job
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="space-y-4">
              {applications.map((application) => (
                <Card key={application.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{application.profiles.full_name}</CardTitle>
                        <CardDescription>
                          Applied for {application.jobs.title} - {application.jobs.events.title}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600">
                        <p>Phone: {application.profiles.phone}</p>
                        <p>Applied: {new Date(application.application_date).toLocaleString()}</p>
                      </div>
                      {application.notes && (
                        <div>
                          <p className="font-medium text-sm">Notes:</p>
                          <p className="text-sm text-gray-700">{application.notes}</p>
                        </div>
                      )}
                      {application.status === 'pending' && (
                        <div className="flex gap-2 mt-4">
                          <Button 
                            size="sm"
                            onClick={() => updateApplicationStatus(application.id, 'approved')}
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateApplicationStatus(application.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {applications.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-600">Applications will appear here when promoters apply for your jobs</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManageJobs;
