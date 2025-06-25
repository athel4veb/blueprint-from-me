
import { IJobRepository } from '@/domain/repositories/IJobRepository';

export class ApplyForJobUseCase {
  constructor(private jobRepository: IJobRepository) {}

  async execute(jobId: string, promoterId: string): Promise<void> {
    await this.jobRepository.applyForJob(jobId, promoterId);
  }
}
