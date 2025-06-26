
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/infrastructure/di/Container';
import { Job } from '@/domain/entities/Job';

export const useJobs = () => {
  const queryClient = useQueryClient();

  const {
    data: jobs = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => container.jobService.getAvailableJobs(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const applyForJobMutation = useMutation({
    mutationFn: ({ jobId, promoterId }: { jobId: string; promoterId: string }) =>
      container.jobService.applyForJob(jobId, promoterId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
    onError: (error) => {
      console.error('Failed to apply for job:', error);
    }
  });

  const getJobByIdMutation = useMutation({
    mutationFn: (jobId: string) => container.jobService.getJobById(jobId),
  });

  const applyForJob = async (jobId: string, promoterId: string) => {
    return applyForJobMutation.mutateAsync({ jobId, promoterId });
  };

  const getJobById = async (jobId: string): Promise<Job | null> => {
    return getJobByIdMutation.mutateAsync(jobId);
  };

  return {
    jobs,
    loading,
    error: error?.message,
    applyForJob,
    getJobById,
    isApplying: applyForJobMutation.isPending,
  };
};
