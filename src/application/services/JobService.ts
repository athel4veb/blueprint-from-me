
import { IJobRepository } from '@/domain/repositories/IJobRepository';
import { Job } from '@/domain/entities/Job';
import { JobApplication } from '@/domain/entities/JobApplication';

export class JobService {
  constructor(private jobRepository: IJobRepository) {}

  async getAvailableJobs(): Promise<Job[]> {
    try {
      return await this.jobRepository.getAvailableJobs();
    } catch (error) {
      throw new Error('Failed to fetch available jobs');
    }
  }

  async getJobById(id: string): Promise<Job | null> {
    try {
      return await this.jobRepository.getJobById(id);
    } catch (error) {
      throw new Error('Failed to fetch job details');
    }
  }

  async applyForJob(jobId: string, promoterId: string): Promise<void> {
    try {
      await this.jobRepository.applyForJob(jobId, promoterId);
    } catch (error) {
      if (error instanceof Error && error.message.includes('23505')) {
        throw new Error('You have already applied for this job');
      }
      throw new Error('Failed to submit application');
    }
  }

  async getApplicationsByPromoter(promoterId: string): Promise<JobApplication[]> {
    try {
      return await this.jobRepository.getApplicationsByPromoter(promoterId);
    } catch (error) {
      throw new Error('Failed to fetch applications');
    }
  }

  async getJobsByCompany(companyId: string): Promise<Job[]> {
    try {
      return await this.jobRepository.getJobsByCompany(companyId);
    } catch (error) {
      throw new Error('Failed to fetch company jobs');
    }
  }

  async updateApplicationStatus(applicationId: string, status: string): Promise<void> {
    try {
      await this.jobRepository.updateApplicationStatus(applicationId, status);
    } catch (error) {
      throw new Error('Failed to update application status');
    }
  }
}
