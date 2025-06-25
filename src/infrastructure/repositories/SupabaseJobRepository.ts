
import { supabase } from '@/integrations/supabase/client';
import { IJobRepository } from '@/domain/repositories/IJobRepository';
import { Job } from '@/domain/entities/Job';
import { JobApplication } from '@/domain/entities/JobApplication';

export class SupabaseJobRepository implements IJobRepository {
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
    return data || [];
  }

  async getJobById(id: string): Promise<Job | null> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
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
    return data || [];
  }

  async createJob(job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<Job> {
    const { data, error } = await supabase
      .from('jobs')
      .insert(job)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateJob(id: string, job: Partial<Job>): Promise<void> {
    const { error } = await supabase
      .from('jobs')
      .update(job)
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
    return data || [];
  }

  async getApplicationsByJob(jobId: string): Promise<JobApplication[]> {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async updateApplicationStatus(applicationId: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('job_applications')
      .update({ status })
      .eq('id', applicationId);

    if (error) throw error;
  }
}
