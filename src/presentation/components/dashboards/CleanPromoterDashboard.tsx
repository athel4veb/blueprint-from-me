
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, DollarSign } from 'lucide-react';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useJobs } from '@/presentation/hooks/useJobs';

const CleanPromoterDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { jobs, loading: jobsLoading, applyForJob } = useJobs();

  const handleApplyForJob = async (jobId: string) => {
    if (!user?.id) return;
    
    try {
      await applyForJob(jobId, user.id);
    } catch (error) {
      console.error('Failed to apply for job:', error);
    }
  };

  if (authLoading || jobsLoading) {
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
          <p className="text-gray-600">Welcome back, {user?.fullName}!</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Available Jobs</h2>
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <CardDescription>Event Job</CardDescription>
                  </div>
                  <Badge variant="secondary">
                    {job.positionsAvailable - job.positionsFilled} positions left
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {job.shiftStart} - {job.shiftEnd}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    ${job.hourlyRate}/hour
                  </div>
                  <p className="text-sm text-gray-700">{job.description}</p>
                  <Button 
                    onClick={() => handleApplyForJob(job.id)}
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
    </div>
  );
};

export default CleanPromoterDashboard;
