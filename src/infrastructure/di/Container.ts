
import { SupabaseUserRepository } from '../repositories/SupabaseUserRepository';
import { SupabaseJobRepository } from '../repositories/SupabaseJobRepository';
import { SupabaseWalletRepository } from '../repositories/SupabaseWalletRepository';
import { SupabaseRatingRepository } from '../repositories/SupabaseRatingRepository';
import { SupabasePaymentRepository } from '../repositories/SupabasePaymentRepository';
import { GetCurrentUserUseCase } from '@/application/usecases/auth/GetCurrentUserUseCase';
import { JobService } from '@/application/services/JobService';
import { WalletService } from '@/application/services/WalletService';
import { RatingService } from '@/application/services/RatingService';
import { PaymentService } from '@/application/services/PaymentService';

class Container {
  // Repositories
  private _userRepository = new SupabaseUserRepository();
  private _jobRepository = new SupabaseJobRepository();
  private _walletRepository = new SupabaseWalletRepository();
  private _ratingRepository = new SupabaseRatingRepository();
  private _paymentRepository = new SupabasePaymentRepository();

  // Use Cases
  public readonly getCurrentUserUseCase = new GetCurrentUserUseCase(this._userRepository);

  // Services
  public readonly jobService = new JobService(this._jobRepository);
  public readonly walletService = new WalletService(this._walletRepository);
  public readonly ratingService = new RatingService(this._ratingRepository);
  public readonly paymentService = new PaymentService(this._paymentRepository);

  // Getters for repositories (if needed for specific use cases)
  get userRepository() { return this._userRepository; }
  get jobRepository() { return this._jobRepository; }
  get walletRepository() { return this._walletRepository; }
  get ratingRepository() { return this._ratingRepository; }
  get paymentRepository() { return this._paymentRepository; }
}

export const container = new Container();
