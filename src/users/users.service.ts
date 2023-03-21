import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { ResponseStandard } from 'utilities/responseStandardApi';
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { Activity } from 'src/activities/entities/activity.entity';
import { UserActivity } from 'src/user-activities/entities/user-activity.entity';
import { CreateActivityDto } from 'src/activities/dto/create-activity.dto';
import { CreateUserActivityDto } from 'src/user-activities/dto/create-user-activity.dto';
import { UpdateUserActivityDto } from 'src/user-activities/dto/update-user-activity.dto';
import { CheckUserDto } from './dto/check-user.dto';
import * as webpush from 'web-push';
// import { CreateActivityDto } from './dto/create-activity.dto';
// import Op from 'sequelize';
const { Op } = require("sequelize");

@Injectable()
export class UsersService {
  vapidKeys = webpush.generateVAPIDKeys();
  private readonly publicKey = this.vapidKeys.publicKey;
  private readonly privateKey = this.vapidKeys.privateKey;
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private jwtService: JwtService,
    @InjectModel(Activity)
    private activityModel: typeof Activity,
    @InjectModel(UserActivity)
    private userActivityModel: typeof UserActivity,
    
) {
  // webpush.setVapidDetails(
  //   'http://localhost:8000',
  //   this.publicKey,
  //   this.privateKey,
  // );
}
  // async sendEventNotification(user: User, userActivity: UserActivity) {
  //   const payload = {
  //     title: `Reminder: Event tomorrow`,
  //     body: `Don't forget that you have an event tomorrow.`,
  //     icon: 'https://example.com/icon.png',
  //   };

  //   try {
  //     await webpush.sendNotification(user.subscription, JSON.stringify(payload));
  //   } catch (error) {
  //     console.error('Failed to send push notification:', error);
  //   }
  // }


  async createUser(createUserDto : CreateUserDto) {
    let response = new ResponseStandard()
    const passwordHash = await bcrypt.hash(createUserDto.password,12);
    createUserDto.password = passwordHash
    let user = await this.userModel.create({...createUserDto})
    let userTest = JSON.parse(JSON.stringify(user));
    const {password, ...result} = userTest
    user.generateEmailVerificationToken();
    await user.save();
    await user.sendVerificationEmail();
    if (!user) {
      response.error_code = "400"
      response.error_message = "Create User Failed"
    } else {
      response.success = true
      response.result = user
    }
    return result
  }
  
  // async postUserActivities(createUserActivityDto : CreateUserActivityDto) {
  //   let response = new ResponseStandard()
  //   let [userActiv, created] = await this.userActivityModel.findOrCreate({ where: {
  //     userId: createUserActivityDto.userId,
  //     activityId: createUserActivityDto.activityId,
  //     } })
    
  //   console.log(createUserActivityDto.date,typeof createUserActivityDto.date)
  //   console.log(userActiv.date,typeof userActiv.date)
  //   if (created) {
  //     userActiv.update({date: [createUserActivityDto.date]})
  //     response.success = true
  //     response.result = userActiv
  //   } else {
  //     if (!(userActiv.date.includes(createUserActivityDto.date))) {
  //       let allDate = [...userActiv.date,createUserActivityDto.date]
  //       userActiv.update({date: allDate})
  //     }
  //     response.result = userActiv
  //   }

  //   return response
  // }

  async postUserActivities2(createUserActivityDto: CreateUserActivityDto,checkUserDto : CheckUserDto,request: Request) {
    let response = new ResponseStandard()
    const cookie = request.cookies['jwt']
    const data = await this.jwtService.verifyAsync(cookie)
    if (data['id']) {
      let [userActiv, created] = await this.userActivityModel.findOrCreate({ where: {
        activityId: createUserActivityDto.activityId,
        date: createUserActivityDto.date
        }})
      let user = await this.userModel.findOne({where: {
        id: data['id']
      }})
      if (user.non_blacklist == true) {
        if (created) {
          console.log('create')
          userActiv.update({userId: [data['id']]})
          response.success = true
          response.result = userActiv
        } else {
          console.log('push')
          if (!(userActiv.userId.includes(data['id']))) {
            let allUser = [...userActiv.userId,data['id']]
            userActiv.update({userId: allUser})
          }
          response.result = userActiv
        }
      } else {
        throw new BadRequestException('black list')
      }
    } else {
      throw new BadRequestException('You are not loging in!!!')
    }

    return response
  }

  async updateConfirmedId(createUserActivityDto: CreateUserActivityDto,updateUserActivityDto: UpdateUserActivityDto, request: Request):Promise<any> {
    let response = new ResponseStandard()
    const cookie = request.cookies['jwt']
    const data = await this.jwtService.verifyAsync(cookie)
    if (data['id']) {
      let userActiv = await this.userActivityModel.findOne({ where: {
        userId: {[Op.contains]:[data['id']],},
        date: createUserActivityDto.date,
        activityId: createUserActivityDto.activityId
      }})
      let ucID = [...userActiv.userIdConfirmed,data['id']]
      let new_uID = userActiv.userId.filter((new_id) => new_id !== data['id'])
      await userActiv.update({userId: new_uID,userIdConfirmed: ucID})
      return userActiv.userId.filter((new_id) => new_id !== data['id'])
    }
  }

  async cancelActivity(createUserActivityDto: CreateUserActivityDto,updateUserActivityDto: UpdateUserActivityDto, request: Request):Promise<any> {
    let response = new ResponseStandard()
    const cookie = request.cookies['jwt']
    const data = await this.jwtService.verifyAsync(cookie)
    if (data['id']) {
      console.log('test')
      let userActiv = await this.userActivityModel.findOne({ where: {
        userId: {[Op.contains]:[data['id']],},
        date: createUserActivityDto.date,
        activityId: createUserActivityDto.activityId
      }})
      if(userActiv) {
        console.log('test2')
        let date_now = new Date()
        let act_date = userActiv.date
        let act_date_gen = new Date(act_date)
        act_date_gen.setDate(act_date_gen.getDate() - 1)
        let date_check = date_now.getDate() < act_date_gen.getDate()
        if (userActiv && !userActiv.is_started && (date_check)) {
          let new_uID = userActiv.userId.filter((new_id) => new_id !== data['id'])
          await userActiv.update({userId: new_uID})
        } else {
          throw new BadRequestException('You can not cancle This activity.')
        }
        return date_now.getDate() < act_date_gen.getDate()
      } else {
        throw new BadRequestException('You are not registered to this activity.')
      }
    }
  }
  
  async GetDataArray(createUserActivityDto: CreateUserActivityDto,request: Request) {
    let response = new ResponseStandard()
    const cookie = request.cookies['jwt']
    const data = await this.jwtService.verifyAsync(cookie)
    
    if (data['id']) {
      let userActivities = this.userActivityModel.findAll({ where: {
        userId: {[Op.contains]:[data['id']],}
      },
      raw: true})
      let test = (await userActivities).map(r => {return r.userId})
      let test2 = test[0].indexOf(data['id'])
      let test3 = test[0].splice(test2,1)
      return test3
      // return (await userActivities).map(r => {return r.userId})
      // return userActivities
    }
  }

  async updateUser(updateUserDto: UpdateUserDto, request: Request) {
    let response = new ResponseStandard()
    const cookie = request.cookies['jwt']
    const data = await this.jwtService.verifyAsync(cookie)
    let user = await this.userModel.findByPk(data['id'])
    if (!user) {
        response.success = false;
        response.error_code = '404';
        response.error_message = 'Account Not Found';
        return response;
    }
    await user.update({ ...updateUserDto });
    response.success = true;
    response.result = { ...updateUserDto };
    return response;
  }

  async loginUser(loginUserDTo : LoginUserDto, response : Response): Promise<any> {
    let responseC = new ResponseStandard()
    let user = await this.userModel.findOne({where: {email: loginUserDTo.email}})
    const jwt = await this.jwtService.signAsync({id: user.id})
    response.cookie('jwt', jwt, {httpOnly: false })

    if (!user) {
        responseC.error_code = "400"
        responseC.error_message = "Invalid User"
        throw new BadRequestException('Invalid User')
    } 
    if (!await bcrypt.compare(loginUserDTo.password, user.password)) {
      responseC.error_code = "400"
      responseC.error_message = "Password not correct"
      throw new BadRequestException('Password not correct')
    }
    else {
        responseC.success = true
        responseC.result = user
    }
    return responseC
  }

  async getUser(request: Request) {
    const cookie = request.cookies['jwt']
    const data = await this.jwtService.verifyAsync(cookie)

    if(!data) {
      throw new UnauthorizedException('Dont have data')
    }
    const user = await this.userModel.findOne({where: {id: data['id']}})

    let userTest = JSON.parse(JSON.stringify(user));
    const {password, ...result} = userTest

    return result
  }

  async getRes(response : Response) {
    return response
  }

  async logoutUser(response : Response) {
    response.clearCookie('jwt')

    return {
      message: 'success'
    }
  }

  async verifyEmail(token: string) {
    console.log('test')
    const user = await this.userModel.findOne({ where: { emailVerificationToken: token } })

    if (!user) {
      return { message: 'Invalid verification token' };
    }

    user.emailVerified = true
    user.emailVerificationToken = null
    await user.save()

    return { message: 'Email verification successful' };
  }

  async resetPassword(createUserDto) {
    const user = await this.userModel.findOne({ where: { email: createUserDto.email } });

    if (!user) {
      throw new Error('User not found');
    }

    user.generateEmailVerificationToken();
    await user.save();

    await user.sendVerificationEmail();

    return { message: 'Password reset email sent' };
  }

  async getTest() {
    return this.activityModel.findAll({include: [UserActivity]})
    // return this.activityModel.findAll({include: [User]})
  }

  async getActivities() {
    return this.activityModel.findAll({})
  }

  async confirmEmail(id:number) {
    // const userId = redis.get(id)
  }


  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
