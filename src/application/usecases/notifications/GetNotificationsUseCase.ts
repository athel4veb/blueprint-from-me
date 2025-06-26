
import { INotificationRepository } from '@/domain/repositories/INotificationRepository';
import { Notification } from '@/domain/entities/Notification';

export class GetNotificationsUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(userId: string): Promise<Notification[]> {
    return this.notificationRepository.getNotificationsByUser(userId);
  }
}
