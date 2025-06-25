
import { Rating, RatingWithDetails } from '../entities/Rating';

export interface IRatingRepository {
  getRatingsGiven(userId: string): Promise<RatingWithDetails[]>;
  getRatingsReceived(userId: string): Promise<RatingWithDetails[]>;
  createRating(rating: Omit<Rating, 'id' | 'createdAt'>): Promise<void>;
  getRatableJobs(userId: string, userType: string): Promise<any[]>;
}
