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
import { UpdateUserActivityDto } from 'src/user-activities/dto/update-user-activity.dto';
import { JwtService } from '@nestjs/jwt';
import { Response, Request, Express } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CheckUserDto } from 'src/users/dto/check-user.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Activity)
    private activityModel: typeof Activity,
    @InjectModel(UserActivity)
    private userActivityModel: typeof UserActivity,
    private jwtService: JwtService,
    // @InjectModel(PdfFile)
    // private pdfFileModel: typeof PdfFile,
) {}
  async createActivity(createActivityDto : CreateActivityDto, request: Request) {
    const cookie = request.cookies['jwt']
    const data = await this.jwtService.verifyAsync(cookie)
    let user = await this.userModel.findByPk(data['id'])
    if (user && user.admin == true) {
      let activity = await this.activityModel.create({...createActivityDto})
      return activity
    }
  }

  async getAllUsers(request: Request,createUserDto: CreateUserDto) {
    const cookie = request.cookies['jwt']
    const data = await this.jwtService.verifyAsync(cookie)
    let user = await this.userModel.findByPk(data['id'])
    if (user && user.admin == true) {
      return await this.userModel.findAll({where: {
        admin: false
      }})
    } else {
      return {
        message: 'You are not login or Yor are not admin'
      }
    }
  }

  async getAllUsersForUser() {
      let user = await this.userModel.findAll({where: {
        admin: false
      },
      order: [['received_hours','DESC']]
      })
      return user
  }

  async updateBlacklist(checkUserDto: CheckUserDto, request: Request) {
    const cookie = request.cookies['jwt']
    const data = await this.jwtService.verifyAsync(cookie)
    let admin = await this.userModel.findByPk(data['id'])
    let user = await this.userModel.findOne({where : {
      id: checkUserDto.id
    }})
    if (user && admin.admin == true) {
      await user.update({non_blacklist: checkUserDto.non_blacklist})
      return user.non_blacklist
    } else {
      return {
        message: 'You are not admin'
      }
    }
  }

  // async updateActivity(id: number, updateActivityDto: UpdateActivityDto): Promise<any> {
  //   let response = new ResponseStandard()
  //   let activity = await this.activityModel.findByPk(id)
  //   if (!activity) {
  //       response.success = false;
  //       response.error_code = '404';
  //       response.error_message = 'Account Not Found';
  //       return response;
  //   }
  //   await activity.update({ ...updateActivityDto });
  //   response.success = true;
  //   response.result = { ...updateActivityDto };
  //   return response;
  // }

  async updateActivity(updateActivityDto: UpdateActivityDto, request: Request) {
    const cookie = request.cookies['jwt']
    const data = await this.jwtService.verifyAsync(cookie)
    let user = await this.userModel.findByPk(data['id'])
    let activity = await this.activityModel.findOne({where : {
      id: updateActivityDto.id,
    }})
    if (!activity) {
      return 'this is no activity you want'
    } else if(user.admin == true){
      await activity.update({...updateActivityDto})
      return activity
    }
  }

  async updateActivityStatus(updateActivityDto: UpdateActivityDto) {
    let activity = await this.activityModel.findOne({where : {
      id: updateActivityDto.id,
    }})
    if (!activity) {
      return 'this is no activity you want'
    } else if(activity.is_open == true) {
      await activity.update({is_open: false})
    } else {
      await activity.update({is_open: true})
    }
  }

  async updateActivityStatusFromToggle(updateActivityDto: UpdateActivityDto, request: Request) {
    const cookie = request.cookies['jwt']
    const data = await this.jwtService.verifyAsync(cookie)
    let user = await this.userModel.findByPk(data['id'])
    let activity = await this.activityModel.findOne({where : {
      id: updateActivityDto.id,
    }})
    if (activity && user.admin == true) {
      await activity.update({is_open: updateActivityDto.is_open})
      return activity.is_open
    } else {
      return {
        message: 'You are not admin'
      }
    }
  }

  async finishActivity(updateUserActivityDto: UpdateUserActivityDto, request: Request) {
    const cookie = request.cookies['jwt']
    const data = await this.jwtService.verifyAsync(cookie)
    let user = await this.userModel.findByPk(data['id'])
    let activity = await this.userActivityModel.findOne({where: {
      id: updateUserActivityDto.id
    }})
    let ac = await this.activityModel.findOne({where: {
      id: activity.activityId
    }})
    if (activity && user.admin == true) {
      if (activity.is_ended == false) {
        await activity.update({ is_ended: true })
        for (let i in activity.userId) {
          console.log(activity.userId[i],'++++++++++++++')
          let user = await this.userModel.findByPk(activity.userId[i])
          let addHours = user.received_hours + ac.received_hours
          await user.update({ received_hours: addHours})
          return {
            message: 'User received activity hours'
          }
        }
      } else {
        return 'You already finish this event.'
      }
      return activity
    } else {
      return {
        message: 'This user activity is not exist or You are not admin'
      }
    }
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

  async getOpenActivity(updateActivityDto: UpdateActivityDto) {
    let Activ = this.activityModel.findAll({ where: {
      is_open: true
    }})
    return Activ
  }

  async getCloseActivity(updateActivityDto: UpdateActivityDto) {
    let Activ = this.activityModel.findAll({ where: {
      is_open: true
    }})
    return Activ
  }
}
