import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserActivitiesService } from './user-activities.service';
import { CreateUserActivityDto } from './dto/create-user-activity.dto';
import { UpdateUserActivityDto } from './dto/update-user-activity.dto';

@Controller('user-activities')
export class UserActivitiesController {
  constructor(private readonly userActivitiesService: UserActivitiesService) {}

  @Post()
  create(@Body() createUserActivityDto: CreateUserActivityDto) {
    return this.userActivitiesService.create(createUserActivityDto);
  }

  @Get()
  findAll() {
    return this.userActivitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userActivitiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserActivityDto: UpdateUserActivityDto) {
    return this.userActivitiesService.update(+id, updateUserActivityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userActivitiesService.remove(+id);
  }
}
