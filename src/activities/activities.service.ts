import { Injectable } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Activity } from './entities/activity.entity';
import { ResponseStandard } from 'utilities/responseStandardApi';
import { InjectModel } from '@nestjs/sequelize';
// import { PdfFile } from './entities/pdfFile.entity';
import { User } from 'src/users/entities/user.entity';
import { UserActivity } from 'src/user-activities/entities/user-activity.entity';
import { PdfFileDto } from './dto/pdf-file.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Activity)
    private activityModel: typeof Activity,
    @InjectModel(UserActivity)
    private userActivityModel: typeof UserActivity,
    // @InjectModel(PdfFile)
    // private pdfFileModel: typeof PdfFile,
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

  async uploadPdf(data: Buffer): Promise<any> {
    console.log(data)
    let response = new ResponseStandard()
    // const pdf = new PdfFile()
    // pdf.activityId = 1
    // pdf.pdfFile = data
    // await pdf.save()
    // return pdf
    // if (!(await this.activityModel.findByPk(pdfFileDto.activityId))) {
    //   response.error_code = "400"
    //   response.error_message = "Blog Category Not Found"
    // } else {
      // let pdf = await this.pdfFileModel.create({activityId: 1, pdfFile: data})
    // }
    return response
  }

  async getOneActivity(id) {
    let response = new ResponseStandard()
        let activ = await this.activityModel.findByPk(id)
        if (!activ) {
            response.error_code = "400"
            response.error_message = "Activity Not Found"
        } else {
            response.success = true
            response.result = activ
        }
        return response
  }
}
