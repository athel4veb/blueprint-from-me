
import { IMessageRepository } from '@/domain/repositories/IMessageRepository';
import { Message } from '@/domain/entities/Message';

export class MessageService {
  constructor(private messageRepository: IMessageRepository) {}

  async getMessagesByUser(userId: string): Promise<Message[]> {
    return this.messageRepository.getMessagesByUser(userId);
  }

  async getConversation(userId1: string, userId2: string): Promise<Message[]> {
    return this.messageRepository.getConversation(userId1, userId2);
  }

  async sendMessage(message: Omit<Message, 'id' | 'createdAt' | 'updatedAt'>): Promise<Message> {
    return this.messageRepository.sendMessage(message);
  }

  async markAsRead(messageId: string): Promise<void> {
    return this.messageRepository.markAsRead(messageId);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.messageRepository.getUnreadCount(userId);
  }
}
