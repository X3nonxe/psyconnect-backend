import { User } from '../entities/user.entity';

export const IUserRepository = Symbol('IUserRepository');

export interface IUserRepository {
  createUser(user: User): Promise<User>;
  findUserByEmail(email: string): Promise<User | null>;
  findUserById(id: string): Promise<User | null>;
}
