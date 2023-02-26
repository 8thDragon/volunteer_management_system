import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';


@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post('createActivity')
  async createActivity(@Body() createActivityDto : CreateActivityDto) {
    return this.activitiesService.createActivity(createActivityDto);
  }

  @Patch(':id')
  updateActivity(@Param('id') id: string, 
                @Body() updateActivityDto: UpdateActivityDto) {
    return this.activitiesService.updateActivity(+id, updateActivityDto);
  }
}
