import { Injectable } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Activity } from './entities/activity.entity';
import { ResponseStandard } from 'utilities/responseStandardApi';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectModel(Activity)
    private activityModel: typeof Activity,
) {}
  async createActivity(createActivityDto : CreateActivityDto) {
    let response = new ResponseStandard()
    let activity = await this.activityModel.create({...createActivityDto})
    if (!activity) {
      response.error_code = "400"
      response.error_message = "Create Failed"
    } else {
      response.success = true
      response.result = activity
    }
    return response
  }

  async updateActivity(id: number, updateActivityDto: UpdateActivityDto): Promise<any> {
    let response = new ResponseStandard()
    let activity = await this.activityModel.findByPk(id)
    if (!activity) {
        response.success = false;
        response.error_code = '404';
        response.error_message = 'Account Not Found';
        return response;
    }
    await activity.update({ ...updateActivityDto });
    response.success = true;
    response.result = { ...updateActivityDto };
    return response;
  }
}
