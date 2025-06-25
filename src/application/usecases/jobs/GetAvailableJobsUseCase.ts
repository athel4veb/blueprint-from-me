
import { IJobRepository } from '@/domain/repositories/IJobRepository';
import { Job } from '@/domain/entities/Job';

export class GetAvailableJobsUseCase {
  constructor(private jobRepository: IJobRepository) {}

  async execute(): Promise<Job[]> {
    return await this.jobRepository.getAvailableJobs();
  }
}
