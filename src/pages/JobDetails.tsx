import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/presentation/contexts/AuthContext';
import { Calendar, MapPin, Clock, DollarSign, Users, ArrowLeft, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useJobs } from '@/presentation/hooks/useJobs';
import { Job } from '@/domain/entities/Job';

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { getJobById, applyForJob } = useJobs();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const jobData = await getJobById(id!);
      setJob(jobData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load job details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApplyForJob = async () => {
    if (!user?.id || !id) return;

    setApplying(true);
    try {
      await applyForJob(id, user.id);
      toast({
        title: "Success",
        description: "Application submitted successfully!",
      });
      setHasApplied(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      if (error.message.includes('already applied')) {
        setHasApplied(true);
      }
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading job details...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
          <Button onClick={() => navigate('/jobs')}>Back to Jobs</Button>
        </div>
      </div>
    );
  }

  const jobWithEvents = job as any;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/jobs')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{job.title}</CardTitle>
                    <CardDescription className="text-lg">{jobWithEvents.events?.title}</CardDescription>
                  </div>
                  <Badge variant="secondary">
                    {job.positionsAvailable - job.positionsFilled} positions left
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {jobWithEvents.events?.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {job.shiftStart} - {job.shiftEnd}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    ${job.hourlyRate}/hour
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {job.positionsAvailable} positions total
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {jobWithEvents.events?.start_date && new Date(jobWithEvents.events.start_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="w-4 h-4 mr-2" />
                    {jobWithEvents.events?.companies?.name}
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Job Description</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
                  </div>

                  {job.requirements && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{job.requirements}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Event Details</h3>
                    <p className="text-gray-700">{jobWithEvents.events?.description}</p>
                    <div className="mt-2 text-sm text-gray-600">
                      <p>Start: {jobWithEvents.events?.start_date && new Date(jobWithEvents.events.start_date).toLocaleString()}</p>
                      <p>End: {jobWithEvents.events?.end_date && new Date(jobWithEvents.events.end_date).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-semibold">{jobWithEvents.events?.companies?.name}</h4>
                  <p className="text-sm text-gray-600">{jobWithEvents.events?.companies?.description}</p>
                  {jobWithEvents.events?.companies?.website && (
                    <a 
                      href={jobWithEvents.events.companies.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Visit Website
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            {user?.user_type === 'promoter' && (
              <Card>
                <CardHeader>
                  <CardTitle>Apply for This Job</CardTitle>
                </CardHeader>
                <CardContent>
                  {hasApplied ? (
                    <div className="text-center">
                      <Badge variant="secondary" className="mb-3">Application Submitted</Badge>
                      <p className="text-sm text-gray-600">
                        You have already applied for this job. Check your dashboard for updates.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        Ready to join this event? Submit your application now!
                      </p>
                      <Button 
                        onClick={handleApplyForJob}
                        disabled={applying}
                        className="w-full"
                      >
                        {applying ? 'Applying...' : 'Apply Now'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
