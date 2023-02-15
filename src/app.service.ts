import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users/entities/user.entity';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World';
  }

  // constructor(
  //   @InjectRepository(User) private readonly userReposotory: Repository<User>
  // ) {

  // }

  // async register(data: any): Promise<User> {
  //   return this.userReposotory.save(data);
  // }
}
