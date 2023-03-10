import { Injectable } from '@nestjs/common';
import { CreateUserActivitiesConfirmedDto } from './dto/create-user-activities-confirmed.dto';
import { UpdateUserActivitiesConfirmedDto } from './dto/update-user-activities-confirmed.dto';

@Injectable()
export class UserActivitiesConfirmedService {
  create(createUserActivitiesConfirmedDto: CreateUserActivitiesConfirmedDto) {
    return 'This action adds a new userActivitiesConfirmed';
  }

  findAll() {
    return `This action returns all userActivitiesConfirmed`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userActivitiesConfirmed`;
  }

  update(id: number, updateUserActivitiesConfirmedDto: UpdateUserActivitiesConfirmedDto) {
    return `This action updates a #${id} userActivitiesConfirmed`;
  }

  remove(id: number) {
    return `This action removes a #${id} userActivitiesConfirmed`;
  }
}
