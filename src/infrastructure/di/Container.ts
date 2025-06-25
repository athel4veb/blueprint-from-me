
import { SupabaseUserRepository } from '../repositories/SupabaseUserRepository';
import { SupabaseJobRepository } from '../repositories/SupabaseJobRepository';
import { SupabaseWalletRepository } from '../repositories/SupabaseWalletRepository';
import { SupabaseRatingRepository } from '../repositories/SupabaseRatingRepository';
import { GetCurrentUserUseCase } from '@/application/usecases/auth/GetCurrentUserUseCase';
import { JobService } from '@/application/services/JobService';
import { WalletService } from '@/application/services/WalletService';
import { RatingService } from '@/application/services/RatingService';

class Container {
  // Repositories
  private _userRepository = new SupabaseUserRepository();
  private _jobRepository = new SupabaseJobRepository();
  private _walletRepository = new SupabaseWalletRepository();
  private _ratingRepository = new SupabaseRatingRepository();

  // Use Cases
  public readonly getCurrentUserUseCase = new GetCurrentUserUseCase(this._userRepository);

  // Services
  public readonly jobService = new JobService(this._jobRepository);
  public readonly walletService = new WalletService(this._walletRepository);
  public readonly ratingService = new RatingService(this._ratingRepository);

  // Getters for repositories (if needed for specific use cases)
  get userRepository() { return this._userRepository; }
  get jobRepository() { return this._jobRepository; }
  get walletRepository() { return this._walletRepository; }
  get ratingRepository() { return this._ratingRepository; }
}

export const container = new Container();
