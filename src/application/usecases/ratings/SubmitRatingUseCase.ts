
import { IRatingRepository } from '@/domain/repositories/IRatingRepository';

export interface SubmitRatingRequest {
  jobId: string;
  raterId: string;
  ratedId: string;
  rating: number;
  comment?: string;
}

export class SubmitRatingUseCase {
  constructor(private ratingRepository: IRatingRepository) {}

  async execute(request: SubmitRatingRequest): Promise<void> {
    await this.ratingRepository.createRating(request);
  }
}
