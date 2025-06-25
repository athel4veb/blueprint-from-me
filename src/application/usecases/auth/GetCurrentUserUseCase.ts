
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { User } from '@/domain/entities/User';

export class GetCurrentUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<User | null> {
    return await this.userRepository.getCurrentUser();
  }
}
