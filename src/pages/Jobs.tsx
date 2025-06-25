
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, DollarSign, Users, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

const Jobs = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [rateFilter, setRateFilter] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, locationFilter, rateFilter]);

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
      setJobs(data || []);
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

  const filterJobs = () => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.events.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter) {
      filtered = filtered.filter(job => 
        job.events.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (rateFilter) {
      const rate = parseFloat(rateFilter);
      filtered = filtered.filter(job => job.hourly_rate >= rate);
    }

    setFilteredJobs(filtered);
  };

  const applyForJob = async (jobId: string) => {
    if (!profile?.id) {
      toast({
        title: "Error",
        description: "Please log in to apply for jobs",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('job_applications')
        .insert({
          job_id: jobId,
          promoter_id: profile.id,
          status: 'pending'
        });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Application submitted successfully!",
      });
      
      // Refresh jobs to update application status
      fetchJobs();
    } catch (error: any) {
      if (error.code === '23505') {
        toast({
          title: "Already Applied",
          description: "You have already applied for this job",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to submit application",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading jobs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Jobs</h1>
          <p className="text-gray-600">Find your next opportunity</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Input
              placeholder="Location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
            <Input
              placeholder="Min hourly rate..."
              type="number"
              value={rateFilter}
              onChange={(e) => setRateFilter(e.target.value)}
            />
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setLocationFilter('');
                setRateFilter('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <CardDescription>{job.events.companies.name}</CardDescription>
                  </div>
                  <Badge variant="secondary">
                    {job.positions_available - job.positions_filled} left
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
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {job.positions_available} positions available
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-3">{job.description}</p>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      variant="outline"
                      className="flex-1"
                    >
                      View Details
                    </Button>
                    {profile?.user_type === 'promoter' && (
                      <Button 
                        onClick={() => applyForJob(job.id)}
                        className="flex-1"
                      >
                        Apply Now
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">Try adjusting your search filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
