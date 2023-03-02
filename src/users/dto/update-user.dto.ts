// import { PartialType } from '@nestjs/mapped-types';
// import { CreateUserDto } from './create-user.dto';

// export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateUserDto {
    name?: string;
    lastname?: string;
    nickname?: string;
    gender?: string;
    religion?: string;
    phoneNumber?: string;
    career?: string;
    workplace?: string;
    congenitalDisease?: string;
    allergicFood?: string;
    talent?: string;
    know_from?: string;
    birthday?: Date;
}