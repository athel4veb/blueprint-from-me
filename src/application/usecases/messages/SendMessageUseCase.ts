
import { IMessageRepository } from '@/domain/repositories/IMessageRepository';
import { Message } from '@/domain/entities/Message';

export class SendMessageUseCase {
  constructor(private messageRepository: IMessageRepository) {}

  async execute(message: Omit<Message, 'id' | 'createdAt' | 'updatedAt'>): Promise<Message> {
    return this.messageRepository.sendMessage(message);
  }
}
