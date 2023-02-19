import { Module } from '@nestjs/common';
import { UserActivitiesService } from './user-activities.service';
import { UserActivitiesController } from './user-activities.controller';

@Module({
  controllers: [UserActivitiesController],
  providers: [UserActivitiesService]
})
export class UserActivitiesModule {}
