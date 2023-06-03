import { BadRequestException, Injectable , HttpException, HttpStatus} from '@nestjs/common';
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
import { CommentDto } from './dto/commnet.dto';
import { Comment } from './entities/comment.entity';
import { CreateUserActivityDto } from 'src/user-activities/dto/create-user-activity.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { RemoveUserDto } from 'src/users/dto/remove-user.dto';
import { CheckUserActivityDto } from 'src/user-activities/dto/check-user-activity.dto';
import { Cron } from '@nestjs/schedule';
import { Notification } from 'src/users/entities/notify.entity';
import { NotifyDto } from 'src/users/dto/create-notify.dto';
const { Op } = require('sequelize');

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Activity)
    private activityModel: typeof Activity,
    @InjectModel(UserActivity)
    private userActivityModel: typeof UserActivity,
    @InjectModel(Comment)
    private commentModel: typeof Comment,
    @InjectModel(Notification)
    private notificationModel: typeof Notification,
    private jwtService: JwtService,
  ) // @InjectModel(PdfFile)
  // private pdfFileModel: typeof PdfFile,
  {}
  async createActivity(createActivityDto: CreateActivityDto, request: Request) {
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    let user = await this.userModel.findByPk(data['id']);
    if (user && user.admin == true) {
      let activity = await this.activityModel.create({ ...createActivityDto });
      return activity;
    } else {
      throw new HttpException(
        'You are not admin',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAllUsers(request: Request, createUserDto: CreateUserDto) {
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    let user = await this.userModel.findByPk(data['id']);
    if (user && user.admin == true) {
      return await this.userModel.findAll({
        where: {
          admin: false,
        },
      });
    } else {
      return {
        message: 'You are not login or Yor are not admin',
      };
    }
  }

  async getLatedActivity(createUserActivityDto: CreateUserActivityDto) {
    let userActiv = this.userActivityModel.findAll({
      where: {
        is_ended: false,
      },
      order: [['date', 'ASC']],
    });
    return userActiv;
  }

  async getLatedActivityEnded(createUserActivityDto: CreateUserActivityDto) {
    let userActiv = this.userActivityModel.findAll({
      where: {
        is_ended: true,
      },
      order: [['date', 'DESC']],
    });
    return userActiv;
  }

  async getAllUsersForUser() {
    let user = await this.userModel.findAll({
      where: {
        admin: false,
      },
      order: [['received_hours', 'DESC']],
      limit: 5,
    });
    return user;
  }

  async updateBlacklist(checkUserDto: CheckUserDto, request: Request) {
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    let admin = await this.userModel.findByPk(data['id']);
    let user = await this.userModel.findOne({
      where: {
        id: checkUserDto.id,
      },
    });
    if (user && admin.admin == true) {
      await user.update({ non_blacklist: checkUserDto.non_blacklist });
      return user.non_blacklist;
    } else {
      return {
        message: 'You are not admin',
      };
    }
  }

  async startActivity() {
    let date_now = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
    let date_check = new Date(new Date().getTime() + 31 * 60 * 60 * 1000);
    console.log(date_check);
    let userActiv_not_start = await this.userActivityModel.findAll({
      where: {
        is_started: false,
      },
    });
    let all_user_ac = (await userActiv_not_start).length;
    for (let i = 0; i < all_user_ac; i++) {
      let userActiv = await this.userActivityModel.findOne({
        where: {
          is_started: false,
          date: {
            [Op.gte]: date_now,
            [Op.lt]: date_check,
          },
        },
      });
      if (userActiv) {
        (await userActiv).update({ is_started: true });
      }
    }
  }

  async getUserActivityById(updateUserActivityDto: UpdateUserActivityDto) {
    let userActiv = this.userActivityModel.findByPk(updateUserActivityDto.id);
    return userActiv;
  }

  async getNotify() {}

  async getUserAcForNotify() {
    let date_now = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
    let date_check = new Date(new Date().getTime() + 31 * 60 * 60 * 1000);
    console.log(date_now);
    console.log(date_check);
    let user = [];
    let userActiv = await this.userActivityModel.findAll({
      where: {
        is_started: false,
        date: {
          [Op.gte]: date_now,
          [Op.lte]: date_check,
        },
      },
    });
    for (let userac of userActiv) {
      if (userac.userId.length > 0) {
        console.log(userac.date >= date_now);
        user.push(userac);
      }
    }

    return user;
  }

  async waitToStartActivity() {
    let userActiv = this.userActivityModel.findAll({
      where: {
        is_started: false,
        is_ended: false,
      },
      order: [['date', 'ASC']],
    });
    return userActiv;
  }

  async ongoingActivity() {
    let userActiv = this.userActivityModel.findAll({
      where: {
        is_started: true,
        is_ended: false,
      },
      order: [['date', 'ASC']],
    });
    return userActiv;
  }

  async endedActivity() {
    let userActiv = this.userActivityModel.findAll({
      where: {
        is_started: true,
        is_ended: true,
      },
      order: [['date', 'DESC']],
    });
    return userActiv;
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
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    let user = await this.userModel.findByPk(data['id']);
    let activity = await this.activityModel.findOne({
      where: {
        id: updateActivityDto.id,
      },
    });
    if (!activity) {
      return 'this is no activity you want';
    } else if (user.admin == true) {
      await activity.update({ ...updateActivityDto });
      return activity;
    }
  }

  async updateActivityStatus(updateActivityDto: UpdateActivityDto) {
    let activity = await this.activityModel.findOne({
      where: {
        id: updateActivityDto.id,
      },
    });
    if (!activity) {
      return 'this is no activity you want';
    } else if (activity.is_open == true) {
      await activity.update({ is_open: false });
    } else {
      await activity.update({ is_open: true });
    }
  }

  async updateActivityStatusFromToggle(
    updateActivityDto: UpdateActivityDto,
    request: Request,
  ) {
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    let user = await this.userModel.findByPk(data['id']);
    let activity = await this.activityModel.findOne({
      where: {
        id: updateActivityDto.id,
      },
    });
    if (activity && user.admin == true) {
      await activity.update({ is_open: updateActivityDto.is_open });
      return activity.is_open;
    } else {
      return {
        message: 'You are not admin',
      };
    }
  }

  async finishActivity(
    updateUserActivityDto: UpdateUserActivityDto,
    request: Request,
  ) {
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    let user = await this.userModel.findByPk(data['id']);
    let activity = await this.userActivityModel.findOne({
      where: {
        id: updateUserActivityDto.id,
      },
    });
    let ac = await this.activityModel.findOne({
      where: {
        id: activity.activityId,
      },
    });
    if (activity && user.admin == true) {
      if (activity.is_ended == false) {
        await activity.update({ is_ended: true });
        for (let i in activity.userId) {
          console.log(activity.userId[i], '++++++++++++++');
          let user = await this.userModel.findByPk(activity.userId[i]);
          let addHours = user.received_hours + ac.received_hours;
          await user.update({ received_hours: addHours });
          this.createNotifyFromFinishedActivity(
            activity.userId[i],
            ac.id,
            `คุณได้เสร็จสิ้นกิจกรรม ${activity.userActivityName} ในวันที่ ${activity.date} และได้รับชั่วโมงการทำกิจกรรม ${ac.received_hours} ชม. เรียบร้อย สามารถรับเอกสารได้ในประวัติการทำกิจกรรม`,
            activity.date,
            false,
          );
        }
      } else {
        return 'You already finish this event.';
      }
      return activity;
    } else {
      return {
        message: 'This user activity is not exist or You are not admin',
      };
    }
  }

  async createNotifyFromFinishedActivity(
    userId,
    activityId,
    detail,
    date,
    is_read,
  ) {
    this.notificationModel.create({
      userId: userId,
      activityId: activityId,
      detail: detail,
      date: date,
      is_read: is_read,
    });
  }

  async notifyUser(notifyDto: NotifyDto) {
    let date_now = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
    let date_check = new Date(new Date().getTime() + 55 * 60 * 60 * 1000);
    console.log(date_check);
    return this.notificationModel.findAll({
      where: {
        userId: notifyDto.userId,
        date: {
          [Op.gte]: date_now,
          [Op.lte]: date_check,
        },
      },
      order: [['date', 'ASC']],
    });
  }

  async getUserInUserActivity(
    updateUserActivityDto: UpdateUserActivityDto,
    request: Request,
  ): Promise<any> {
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    let admin = await this.userModel.findByPk(data['id']);
    if (admin.admin == true) {
      console.log('test');
      let all_user = [];
      let userActiv = await this.userActivityModel.findByPk(
        updateUserActivityDto.id,
      );
      if (userActiv) {
        for (let userId of userActiv.userId) {
          let user = await this.userModel.findByPk(userId);
          all_user.push(user);
        }
        return all_user;
      }
    }
  }

  async removeUserFromUserActivity(
    removeUserDto: RemoveUserDto,
    request: Request,
  ) {
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    let admin = await this.userModel.findByPk(data['id']);
    let userActiv = await this.userActivityModel.findOne({
      where: {
        id: removeUserDto.userActivityId,
      },
    });
    if (userActiv && admin.admin == true) {
      console.log(userActiv.userId);
      let new_uID = userActiv.userId.filter(
        (new_id) => new_id !== removeUserDto.userId,
      );
      await userActiv.update({ userId: new_uID });
      return userActiv;
    } else {
      return {
        message: 'errors',
      };
    }
  }

  async removeUserFromUserActivityForBlacklist(
    removeUserDto: RemoveUserDto,
    request: Request,
  ) {
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    let admin = await this.userModel.findByPk(data['id']);
    let userActiv = await this.userActivityModel.findOne({
      where: {
        id: removeUserDto.userActivityId,
      },
    });
    if (userActiv && admin.admin == true) {
      console.log(userActiv.userId);
      let new_uID = userActiv.userId.filter(
        (new_id) => new_id !== removeUserDto.userId,
      );
      await userActiv.update({ userId: new_uID });
      return userActiv;
    } else {
      return {
        message: 'errors',
      };
    }
  }

  async postComment(commentDto: CommentDto, request: Request) {
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    let user = await this.userModel.findByPk(data['id']);
  }

  async getAllComment() {
    let comment = await this.commentModel.findAll();
    return comment;
  }

  async getComment(updateActivityDto: UpdateActivityDto) {
    let comment = await this.commentModel.findAll({
      where: {
        id: updateActivityDto.id,
      },
    });
    return comment;
  }

  async getCommentFromUserAc(commentDto: CommentDto) {
    let commentUserAc = await this.commentModel.findAll({
      where: {
        activityId: commentDto.activityId,
      },
      // order: [['comment_date', 'ASC']],
    });
    return commentUserAc;
  }

  async uploadPdf(data: Buffer): Promise<any> {
    console.log(data);
    let response = new ResponseStandard();
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
    return response;
  }

  async getOneActivity(id) {
    let response = new ResponseStandard();
    let activ = await this.activityModel.findByPk(id);
    if (!activ) {
      response.error_code = '400';
      response.error_message = 'Activity Not Found';
    } else {
      response.success = true;
      response.result = activ;
    }
    return response;
  }

  async getOpenActivity(updateActivityDto: UpdateActivityDto) {
    let Activ = this.activityModel.findAll({
      where: {
        is_open: true,
      },
    });
    return Activ;
  }

  async getCloseActivity(updateActivityDto: UpdateActivityDto) {
    let Activ = this.activityModel.findAll({
      where: {
        is_open: true,
      },
    });
    return Activ;
  }
}
