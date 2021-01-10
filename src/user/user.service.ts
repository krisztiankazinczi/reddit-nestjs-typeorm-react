import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  createUser(email, username, password): User {
    return this.userRepository.create({ email, username, password });
  }

  async register(user: User): Promise<User> {
    user.hashPassword();
    return await this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ email });
  }

  findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ username });
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  getUserSubmissions(username: string) {
    return this.userRepository.findOneOrFail({
      where: { username },
      select: ['username', 'createdAt'],
    });
  }
}
