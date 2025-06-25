
import { GetCurrentUserUseCase } from '@/application/usecases/auth/GetCurrentUserUseCase';
import { GetAvailableJobsUseCase } from '@/application/usecases/jobs/GetAvailableJobsUseCase';
import { ApplyForJobUseCase } from '@/application/usecases/jobs/ApplyForJobUseCase';
import { GetRatingsUseCase } from '@/application/usecases/ratings/GetRatingsUseCase';
import { SubmitRatingUseCase } from '@/application/usecases/ratings/SubmitRatingUseCase';
import { GetWalletDataUseCase } from '@/application/usecases/wallet/GetWalletDataUseCase';

import { SupabaseUserRepository } from '@/infrastructure/repositories/SupabaseUserRepository';
import { SupabaseJobRepository } from '@/infrastructure/repositories/SupabaseJobRepository';
import { SupabaseRatingRepository } from '@/infrastructure/repositories/SupabaseRatingRepository';
import { SupabaseWalletRepository } from '@/infrastructure/repositories/SupabaseWalletRepository';

class Container {
  // Repositories
  private userRepository = new SupabaseUserRepository();
  private jobRepository = new SupabaseJobRepository();
  private ratingRepository = new SupabaseRatingRepository();
  private walletRepository = new SupabaseWalletRepository();

  // Use Cases
  getCurrentUserUseCase = new GetCurrentUserUseCase(this.userRepository);
  getAvailableJobsUseCase = new GetAvailableJobsUseCase(this.jobRepository);
  applyForJobUseCase = new ApplyForJobUseCase(this.jobRepository);
  getRatingsUseCase = new GetRatingsUseCase(this.ratingRepository);
  submitRatingUseCase = new SubmitRatingUseCase(this.ratingRepository);
  getWalletDataUseCase = new GetWalletDataUseCase(this.walletRepository);
}

export const container = new Container();
