
import { IMessageRepository } from '@/domain/repositories/IMessageRepository';
import { Message } from '@/domain/entities/Message';

export class GetMessagesUseCase {
  constructor(private messageRepository: IMessageRepository) {}

  async execute(userId: string): Promise<Message[]> {
    return this.messageRepository.getMessagesByUser(userId);
  }
}
