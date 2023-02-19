import { Injectable } from '@nestjs/common';
import { CreateUserActivityDto } from './dto/create-user-activity.dto';
import { UpdateUserActivityDto } from './dto/update-user-activity.dto';

@Injectable()
export class UserActivitiesService {
  create(createUserActivityDto: CreateUserActivityDto) {
    return 'This action adds a new userActivity';
  }

  findAll() {
    return `This action returns all userActivities`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userActivity`;
  }

  update(id: number, updateUserActivityDto: UpdateUserActivityDto) {
    return `This action updates a #${id} userActivity`;
  }

  remove(id: number) {
    return `This action removes a #${id} userActivity`;
  }
}
