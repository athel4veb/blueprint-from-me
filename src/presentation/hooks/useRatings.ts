
import { useState, useEffect } from 'react';
import { container } from '@/infrastructure/di/Container';
import { Rating, RatingWithDetails } from '@/domain/entities/Rating';

export const useRatings = (userId: string, userType: string) => {
  const [ratingsGiven, setRatingsGiven] = useState<RatingWithDetails[]>([]);
  const [ratingsReceived, setRatingsReceived] = useState<RatingWithDetails[]>([]);
  const [ratableJobs, setRatableJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRatings = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      
      const [given, received, jobs] = await Promise.all([
        container.ratingService.getRatingsGiven(userId),
        container.ratingService.getRatingsReceived(userId),
        container.ratingService.getRatableJobs(userId, userType)
      ]);

      setRatingsGiven(given);
      setRatingsReceived(received);
      setRatableJobs(jobs);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [userId, userType]);

  const submitRating = async (rating: Omit<Rating, 'id' | 'createdAt'>) => {
    try {
      await container.ratingService.createRating(rating);
      await fetchRatings(); // Refresh data
    } catch (error) {
      throw error;
    }
  };

  const getAverageRating = () => {
    return container.ratingService.calculateAverageRating(ratingsReceived);
  };

  return {
    ratingsGiven,
    ratingsReceived,
    ratableJobs,
    loading,
    error,
    submitRating,
    getAverageRating,
    refetch: fetchRatings
  };
};
