
import { INotificationRepository } from '@/domain/repositories/INotificationRepository';
import { Notification } from '@/domain/entities/Notification';

export class CreateNotificationUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    return this.notificationRepository.createNotification(notification);
  }
}
