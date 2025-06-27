
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/infrastructure/di/Container';
import { Job } from '@/domain/entities/Job';
import { useAuth } from '@/presentation/contexts/AuthContext';

export const useJobs = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const jobsQuery = useQuery({
    queryKey: ['jobs'],
    queryFn: () => container.jobRepository.getAllJobs(),
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const getJobById = async (jobId: string): Promise<Job> => {
    return container.jobRepository.getJobById(jobId);
  };

  const applyForJob = async (jobId: string, promoterId: string) => {
    return container.jobRepository.applyForJob(jobId, promoterId);
  };

  return {
    jobs: jobsQuery.data || [],
    loading: jobsQuery.isLoading,
    error: jobsQuery.error?.message,
    getJobById,
    applyForJob
  };
};
