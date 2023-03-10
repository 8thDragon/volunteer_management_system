import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserActivitiesConfirmedService } from './user-activities-confirmed.service';
import { CreateUserActivitiesConfirmedDto } from './dto/create-user-activities-confirmed.dto';
import { UpdateUserActivitiesConfirmedDto } from './dto/update-user-activities-confirmed.dto';

@Controller('user-activities-confirmed')
export class UserActivitiesConfirmedController {
  constructor(private readonly userActivitiesConfirmedService: UserActivitiesConfirmedService) {}

  @Post()
  create(@Body() createUserActivitiesConfirmedDto: CreateUserActivitiesConfirmedDto) {
    return this.userActivitiesConfirmedService.create(createUserActivitiesConfirmedDto);
  }

  @Get()
  findAll() {
    return this.userActivitiesConfirmedService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userActivitiesConfirmedService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserActivitiesConfirmedDto: UpdateUserActivitiesConfirmedDto) {
    return this.userActivitiesConfirmedService.update(+id, updateUserActivitiesConfirmedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userActivitiesConfirmedService.remove(+id);
  }
}
