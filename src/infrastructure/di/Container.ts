
import { SupabaseUserRepository } from '../repositories/SupabaseUserRepository';
import { SupabaseJobRepository } from '../repositories/SupabaseJobRepository';
import { SupabaseWalletRepository } from '../repositories/SupabaseWalletRepository';
import { SupabaseRatingRepository } from '../repositories/SupabaseRatingRepository';
import { SupabasePaymentRepository } from '../repositories/SupabasePaymentRepository';
import { SupabaseMessageRepository } from '../repositories/SupabaseMessageRepository';
import { SupabaseNotificationRepository } from '../repositories/SupabaseNotificationRepository';
import { SupabaseEventRepository } from '../repositories/SupabaseEventRepository';
import { GetCurrentUserUseCase } from '@/application/usecases/auth/GetCurrentUserUseCase';
import { GetNotificationsUseCase } from '@/application/usecases/notifications/GetNotificationsUseCase';
import { CreateNotificationUseCase } from '@/application/usecases/notifications/CreateNotificationUseCase';
import { GetMessagesUseCase } from '@/application/usecases/messages/GetMessagesUseCase';
import { SendMessageUseCase } from '@/application/usecases/messages/SendMessageUseCase';
import { JobService } from '@/application/services/JobService';
import { WalletService } from '@/application/services/WalletService';
import { RatingService } from '@/application/services/RatingService';
import { PaymentService } from '@/application/services/PaymentService';
import { MessageService } from '@/application/services/MessageService';
import { NotificationService } from '@/application/services/NotificationService';
import { EventService } from '@/application/services/EventService';

class Container {
  // Repositories
  private _userRepository = new SupabaseUserRepository();
  private _jobRepository = new SupabaseJobRepository();
  private _walletRepository = new SupabaseWalletRepository();
  private _ratingRepository = new SupabaseRatingRepository();
  private _paymentRepository = new SupabasePaymentRepository();
  private _messageRepository = new SupabaseMessageRepository();
  private _notificationRepository = new SupabaseNotificationRepository();
  private _eventRepository = new SupabaseEventRepository();

  // Use Cases
  public readonly getCurrentUserUseCase = new GetCurrentUserUseCase(this._userRepository);
  public readonly getNotificationsUseCase = new GetNotificationsUseCase(this._notificationRepository);
  public readonly createNotificationUseCase = new CreateNotificationUseCase(this._notificationRepository);
  public readonly getMessagesUseCase = new GetMessagesUseCase(this._messageRepository);
  public readonly sendMessageUseCase = new SendMessageUseCase(this._messageRepository);

  // Services
  public readonly jobService = new JobService(this._jobRepository);
  public readonly walletService = new WalletService(this._walletRepository);
  public readonly ratingService = new RatingService(this._ratingRepository);
  public readonly paymentService = new PaymentService(this._paymentRepository);
  public readonly messageService = new MessageService(this._messageRepository);
  public readonly notificationService = new NotificationService(this._notificationRepository);
  public readonly eventService = new EventService(this._eventRepository);

  // Getters for repositories (if needed for specific use cases)
  get userRepository() { return this._userRepository; }
  get jobRepository() { return this._jobRepository; }
  get walletRepository() { return this._walletRepository; }
  get ratingRepository() { return this._ratingRepository; }
  get paymentRepository() { return this._paymentRepository; }
  get messageRepository() { return this._messageRepository; }
  get notificationRepository() { return this._notificationRepository; }
  get eventRepository() { return this._eventRepository; }
}

export const container = new Container();
