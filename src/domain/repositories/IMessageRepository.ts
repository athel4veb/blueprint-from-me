
import { Message } from '../entities/Message';

export interface IMessageRepository {
  getMessagesByUser(userId: string): Promise<Message[]>;
  getConversation(userId1: string, userId2: string): Promise<Message[]>;
  sendMessage(message: Omit<Message, 'id' | 'createdAt' | 'updatedAt'>): Promise<Message>;
  markAsRead(messageId: string): Promise<void>;
  getUnreadCount(userId: string): Promise<number>;
}
