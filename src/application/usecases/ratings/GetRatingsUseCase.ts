
import { IRatingRepository } from '@/domain/repositories/IRatingRepository';
import { RatingWithDetails } from '@/domain/entities/Rating';

export class GetRatingsUseCase {
  constructor(private ratingRepository: IRatingRepository) {}

  async execute(userId: string): Promise<{
    ratingsGiven: RatingWithDetails[];
    ratingsReceived: RatingWithDetails[];
  }> {
    const [ratingsGiven, ratingsReceived] = await Promise.all([
      this.ratingRepository.getRatingsGiven(userId),
      this.ratingRepository.getRatingsReceived(userId)
    ]);

    return { ratingsGiven, ratingsReceived };
  }
}
