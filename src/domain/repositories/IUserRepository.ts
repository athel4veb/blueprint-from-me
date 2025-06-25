
import { User } from '../entities/User';

export interface IUserRepository {
  getCurrentUser(): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  updateUser(user: Partial<User>): Promise<void>;
}
