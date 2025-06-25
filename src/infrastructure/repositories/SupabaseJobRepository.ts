
import { supabase } from '@/integrations/supabase/client';
import { IJobRepository } from '@/domain/repositories/IJobRepository';
import { Job } from '@/domain/entities/Job';
import { JobApplication } from '@/domain/entities/JobApplication';

export class SupabaseJobRepository implements IJobRepository {
  private mapToJob(data: any): Job {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      requirements: data.requirements,
      positionsAvailable: data.positions_available,
      positionsFilled: data.positions_filled,
      hourlyRate: data.hourly_rate,
      shiftStart: data.shift_start,
      shiftEnd: data.shift_end,
      status: data.status,
      eventId: data.event_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  private mapToJobApplication(data: any): JobApplication {
    return {
      id: data.id,
      jobId: data.job_id,
      promoterId: data.promoter_id,
      status: data.status as 'pending' | 'approved' | 'rejected',
      applicationDate: data.application_date,
      notes: data.notes,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  async getAvailableJobs(): Promise<Job[]> {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        events (
          title,
          location,
          start_date,
          end_date,
          companies (name)
        )
      `)
      .eq('status', 'open')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(job => this.mapToJob(job));
  }

  async getJobById(id: string): Promise<Job | null> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data ? this.mapToJob(data) : null;
  }

  async getJobsByCompany(companyId: string): Promise<Job[]> {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        events!inner (*)
      `)
      .eq('events.company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(job => this.mapToJob(job));
  }

  async createJob(job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<Job> {
    const { data, error } = await supabase
      .from('jobs')
      .insert({
        title: job.title,
        description: job.description,
        requirements: job.requirements,
        positions_available: job.positionsAvailable,
        positions_filled: job.positionsFilled,
        hourly_rate: job.hourlyRate,
        shift_start: job.shiftStart,
        shift_end: job.shiftEnd,
        status: job.status,
        event_id: job.eventId
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapToJob(data);
  }

  async updateJob(id: string, job: Partial<Job>): Promise<void> {
    const updateData: any = {};
    if (job.title !== undefined) updateData.title = job.title;
    if (job.description !== undefined) updateData.description = job.description;
    if (job.requirements !== undefined) updateData.requirements = job.requirements;
    if (job.positionsAvailable !== undefined) updateData.positions_available = job.positionsAvailable;
    if (job.positionsFilled !== undefined) updateData.positions_filled = job.positionsFilled;
    if (job.hourlyRate !== undefined) updateData.hourly_rate = job.hourlyRate;
    if (job.shiftStart !== undefined) updateData.shift_start = job.shiftStart;
    if (job.shiftEnd !== undefined) updateData.shift_end = job.shiftEnd;
    if (job.status !== undefined) updateData.status = job.status;

    const { error } = await supabase
      .from('jobs')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
  }

  async applyForJob(jobId: string, promoterId: string): Promise<void> {
    const { error } = await supabase
      .from('job_applications')
      .insert({
        job_id: jobId,
        promoter_id: promoterId,
        status: 'pending'
      });

    if (error) throw error;
  }

  async getApplicationsByPromoter(promoterId: string): Promise<JobApplication[]> {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('promoter_id', promoterId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(app => this.mapToJobApplication(app));
  }

  async getApplicationsByJob(jobId: string): Promise<JobApplication[]> {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(app => this.mapToJobApplication(app));
  }

  async updateApplicationStatus(applicationId: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('job_applications')
      .update({ status })
      .eq('id', applicationId);

    if (error) throw error;
  }
}
