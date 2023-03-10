import { Module } from '@nestjs/common';
import { UserActivitiesConfirmedService } from './user-activities-confirmed.service';
import { UserActivitiesConfirmedController } from './user-activities-confirmed.controller';

@Module({
  controllers: [UserActivitiesConfirmedController],
  providers: [UserActivitiesConfirmedService]
})
export class UserActivitiesConfirmedModule {}
