
import { useState, useEffect } from 'react';
import { container } from '@/infrastructure/di/Container';
import { Job } from '@/domain/entities/Job';

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const availableJobs = await container.getAvailableJobsUseCase.execute();
        setJobs(availableJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const applyForJob = async (jobId: string, promoterId: string) => {
    try {
      await container.applyForJobUseCase.execute(jobId, promoterId);
      // Refresh jobs after application
      const availableJobs = await container.getAvailableJobsUseCase.execute();
      setJobs(availableJobs);
    } catch (error) {
      console.error('Error applying for job:', error);
      throw error;
    }
  };

  return { jobs, loading, applyForJob };
};
