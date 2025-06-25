
import { Job } from '../entities/Job';
import { JobApplication } from '../entities/JobApplication';

export interface IJobRepository {
  getAvailableJobs(): Promise<Job[]>;
  getJobById(id: string): Promise<Job | null>;
  getJobsByCompany(companyId: string): Promise<Job[]>;
  createJob(job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<Job>;
  updateJob(id: string, job: Partial<Job>): Promise<void>;
  applyForJob(jobId: string, promoterId: string): Promise<void>;
  getApplicationsByPromoter(promoterId: string): Promise<JobApplication[]>;
  getApplicationsByJob(jobId: string): Promise<JobApplication[]>;
  updateApplicationStatus(applicationId: string, status: string): Promise<void>;
}
