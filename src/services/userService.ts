import {db} from '../storage/db';
import type {User} from '../types/user';
import type {UserDto} from '../schemas/userSchema';

class UserService {

  findById(id: string): User | undefined {
    return db.users.getById(id);
  }

  findAll(): User[] {
    return db.users.getAll();
  }

  create(dto: UserDto): User {
    const user: User = {
      id: crypto.randomUUID(),
      ...dto
    }
    db.users.save(user);
    return user;
  }

  existsEmail(email: string): boolean {
    return db.users.getAll().some(user => user.email === email);
  }
}

export const userService = new UserService();