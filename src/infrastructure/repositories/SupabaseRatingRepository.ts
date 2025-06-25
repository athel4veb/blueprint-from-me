
import { supabase } from '@/integrations/supabase/client';
import { IRatingRepository } from '@/domain/repositories/IRatingRepository';
import { Rating, RatingWithDetails } from '@/domain/entities/Rating';

export class SupabaseRatingRepository implements IRatingRepository {
  private mapToRatingWithDetails(data: any): RatingWithDetails {
    return {
      id: data.id,
      rating: data.rating,
      comment: data.comment,
      jobId: data.job_id,
      raterId: data.rater_id,
      ratedId: data.rated_id,
      createdAt: data.created_at,
      job: data.jobs ? {
        title: data.jobs.title,
        event: {
          title: data.jobs.events?.title
        }
      } : undefined,
      rater: data.rater ? {
        fullName: data.rater.full_name
      } : undefined,
      rated: data.rated ? {
        fullName: data.rated.full_name
      } : undefined
    };
  }

  async getRatingsGiven(userId: string): Promise<RatingWithDetails[]> {
    const { data, error } = await supabase
      .from('ratings')
      .select(`
        *,
        jobs (title, events (title)),
        rated:profiles!ratings_rated_id_fkey (full_name)
      `)
      .eq('rater_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(rating => this.mapToRatingWithDetails(rating));
  }

  async getRatingsReceived(userId: string): Promise<RatingWithDetails[]> {
    const { data, error } = await supabase
      .from('ratings')
      .select(`
        *,
        jobs (title, events (title)),
        rater:profiles!ratings_rater_id_fkey (full_name)
      `)
      .eq('rated_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(rating => this.mapToRatingWithDetails(rating));
  }

  async createRating(rating: Omit<Rating, 'id' | 'createdAt'>): Promise<void> {
    const { error } = await supabase
      .from('ratings')
      .insert({
        rating: rating.rating,
        comment: rating.comment,
        job_id: rating.jobId,
        rater_id: rating.raterId,
        rated_id: rating.ratedId
      });

    if (error) throw error;
  }

  async getRatableJobs(userId: string, userType: string): Promise<any[]> {
    if (userType === 'company') {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          id,
          title,
          events (title),
          job_applications (promoter_id, status)
        `)
        .eq('events.companies.owner_id', userId)
        .eq('job_applications.status', 'approved');

      if (error) throw error;
      return data || [];
    } else if (userType === 'promoter') {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          id,
          title,
          events (title)
        `)
        .eq('job_applications.promoter_id', userId)
        .eq('job_applications.status', 'approved');

      if (error) throw error;
      return data || [];
    }

    return [];
  }
}
