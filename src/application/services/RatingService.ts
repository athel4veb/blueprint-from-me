
import { IRatingRepository } from '@/domain/repositories/IRatingRepository';
import { Rating, RatingWithDetails } from '@/domain/entities/Rating';

export class RatingService {
  constructor(private ratingRepository: IRatingRepository) {}

  async getRatingsGiven(userId: string): Promise<RatingWithDetails[]> {
    try {
      return await this.ratingRepository.getRatingsGiven(userId);
    } catch (error) {
      throw new Error('Failed to fetch ratings given');
    }
  }

  async getRatingsReceived(userId: string): Promise<RatingWithDetails[]> {
    try {
      return await this.ratingRepository.getRatingsReceived(userId);
    } catch (error) {
      throw new Error('Failed to fetch ratings received');
    }
  }

  async createRating(rating: Omit<Rating, 'id' | 'createdAt'>): Promise<void> {
    if (rating.rating < 1 || rating.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    if (!rating.jobId || !rating.raterId || !rating.ratedId) {
      throw new Error('Job ID, rater ID, and rated ID are required');
    }

    try {
      await this.ratingRepository.createRating(rating);
    } catch (error) {
      throw new Error('Failed to submit rating');
    }
  }

  async getRatableJobs(userId: string, userType: string): Promise<any[]> {
    try {
      return await this.ratingRepository.getRatableJobs(userId, userType);
    } catch (error) {
      throw new Error('Failed to fetch ratable jobs');
    }
  }

  calculateAverageRating(ratings: RatingWithDetails[]): number {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return Math.round((sum / ratings.length) * 10) / 10;
  }
}
