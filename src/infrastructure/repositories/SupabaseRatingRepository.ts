
import { supabase } from '@/integrations/supabase/client';
import { IRatingRepository } from '@/domain/repositories/IRatingRepository';
import { Rating, RatingWithDetails } from '@/domain/entities/Rating';

export class SupabaseRatingRepository implements IRatingRepository {
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
    return data || [];
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
    return data || [];
  }

  async createRating(rating: Omit<Rating, 'id' | 'createdAt'>): Promise<void> {
    const { error } = await supabase
      .from('ratings')
      .insert(rating);

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
