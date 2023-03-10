import { PartialType } from '@nestjs/swagger';
import { CreateUserActivitiesConfirmedDto } from './create-user-activities-confirmed.dto';

export class UpdateUserActivitiesConfirmedDto extends PartialType(CreateUserActivitiesConfirmedDto) {}
