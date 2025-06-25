
import { useState, useEffect } from 'react';
import { container } from '@/infrastructure/di/Container';
import { RatingWithDetails } from '@/domain/entities/Rating';

export const useRatings = (userId: string) => {
  const [ratingsGiven, setRatingsGiven] = useState<RatingWithDetails[]>([]);
  const [ratingsReceived, setRatingsReceived] = useState<RatingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRatings = async () => {
    try {
      const { ratingsGiven, ratingsReceived } = await container.getRatingsUseCase.execute(userId);
      setRatingsGiven(ratingsGiven);
      setRatingsReceived(ratingsReceived);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchRatings();
    }
  }, [userId]);

  const submitRating = async (request: {
    jobId: string;
    raterId: string;
    ratedId: string;
    rating: number;
    comment?: string;
  }) => {
    try {
      await container.submitRatingUseCase.execute(request);
      await fetchRatings(); // Refresh data
    } catch (error) {
      console.error('Error submitting rating:', error);
      throw error;
    }
  };

  return { ratingsGiven, ratingsReceived, loading, submitRating };
};
