
import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useJobs } from '@/presentation/hooks/useJobs';
import { JobFilters } from '@/components/jobs/JobFilters';
import { JobCard } from '@/components/jobs/JobCard';

const Jobs = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { jobs, loading, error, applyForJob } = useJobs();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [rateFilter, setRateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = !searchTerm || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job as any).events?.title?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation = !locationFilter ||
        (job as any).events?.location?.toLowerCase().includes(locationFilter.toLowerCase());

      const matchesRate = !rateFilter ||
        (job.hourlyRate || 0) >= parseFloat(rateFilter);

      const matchesStatus = !statusFilter || job.status === statusFilter;

      return matchesSearch && matchesLocation && matchesRate && matchesStatus;
    });
  }, [jobs, searchTerm, locationFilter, rateFilter, statusFilter]);

  const handleApplyForJob = async (jobId: string) => {
    if (!profile?.id) {
      toast({
        title: "Error",
        description: "Please log in to apply for jobs",
        variant: "destructive",
      });
      return;
    }

    try {
      await applyForJob(jobId, profile.id);
      toast({
        title: "Success",
        description: "Application submitted successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setRateFilter('');
    setStatusFilter('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading jobs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Jobs</h1>
          <p className="text-gray-600">{error}</p>
        </div>
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

        <JobFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          locationFilter={locationFilter}
          onLocationChange={setLocationFilter}
          rateFilter={rateFilter}
          onRateChange={setRateFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          onClearFilters={clearFilters}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job as any}
              userType={profile?.user_type}
              onViewDetails={(jobId) => navigate(`/jobs/${jobId}`)}
              onApply={handleApplyForJob}
            />
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
