import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { ResponseStandard } from 'utilities/responseStandardApi';
import * as bcrypt from 'bcrypt';
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
import { WebSocketGateway } from '@nestjs/websockets/decorators/socket-gateway.decorator';
import { WebSocketServer } from '@nestjs/websockets/decorators/gateway-server.decorator';
import { SubscribeMessage } from '@nestjs/websockets/decorators/subscribe-message.decorator';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  Query,
  Sse,
  ExecutionContext,
} from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { REQUEST } from '@nestjs/core';
import { CommentDto } from 'src/activities/dto/commnet.dto';
import { Comment } from 'src/activities/entities/comment.entity';
import * as jwt from 'jsonwebtoken';
import { io } from 'socket.io-client';
import { AuthGuard } from '@nestjs/passport';
import { Notification } from './entities/notify.entity';
import { NotifyDto } from 'src/activities/dto/notify.dto';
import { throwError } from 'rxjs';

// import { CreateActivityDto } from './dto/create-activity.dto';
// import Op from 'sequelize';
const { Op } = require('sequelize');
@WebSocketGateway()
@Injectable()
export class UsersService
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('Socket.IO server initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  notifyClients() {
    // Get a list of all connected clients
    const connectedClients = this.server.sockets.sockets;

    // Loop through the connected clients and send a message to each one
    connectedClients.forEach((client) => {
      if (true) {
        // If the client is in both 'room1' and 'room2', send them a message
        client.emit('new-notification', { message: 'New notification!' });
      }
    });
  }

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
    @InjectModel(UserActivity)
    private userActivity: typeof UserActivity,
    @InjectModel(Comment)
    private commentModel: typeof Comment,
    @InjectModel(Notification)
    private notificationModel: typeof Notification,
    @Inject('REQUEST') private readonly request: Request,
  ) {}
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

  async createUser(createUserDto: CreateUserDto) {
    let response = new ResponseStandard();
    let userCheckEmail = await this.userModel.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log('test11111111111111111111111111');
    if (regex.test(createUserDto.email)) {
      if (!userCheckEmail) {
        console.log('test2222222222222222222222222222');
        const passwordHash = await bcrypt.hash(createUserDto.password, 12);
        createUserDto.password = passwordHash;
        let user = await this.userModel.create({ ...createUserDto });
        let userTest = JSON.parse(JSON.stringify(user));
        const { password, ...result } = userTest;
        user.generateEmailVerificationToken();
        await user.save();
        await user.sendVerificationEmail();
        // if (!user) {
        //   return {
        //     message: 'This e-mail is already used',
        //   };
        // } else {
        //   response.success = true;
        //   response.result = user;
        // }
      } else {
        throw new HttpException(
          'This e-mail is already used',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      throw new HttpException('Wrong email format', HttpStatus.BAD_REQUEST);
    }
    return {
      message: 'Registered success',
    };
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

  async postUserActivities2(
    createUserActivityDto: CreateUserActivityDto,
    createActivityDto: CreateActivityDto,
    checkUserDto: CheckUserDto,
    request: Request,
  ) {
    let response = new ResponseStandard();
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    let activityForDateCheck = this.activityModel.findOne({
      where: {
        id: createUserActivityDto.activityId,
        start_date: {
          [Op.lte]: createUserActivityDto.date,
        },
        end_date: {
          [Op.gte]: createUserActivityDto.date,
        },
      },
    });

    let date_now = new Date();
    let user_act_date = createUserActivityDto.date;
    let act_date_gen = new Date(user_act_date);
    act_date_gen.setDate(act_date_gen.getDate());
    console.log(date_now);
    console.log(act_date_gen);
    let date_check = date_now < act_date_gen;
    if (data['id']) {
      console.log(createUserActivityDto.date);
      // console.log(
      //   (await activityForDateCheck).start_date <= createUserActivityDto.date,
      // );
      if (activityForDateCheck && date_check) {
        let AnotherUserActivForCheckDate = await this.userActivityModel.findOne(
          {
            where: {
              userId: { [Op.contains]: [data['id']] },
              date: createUserActivityDto.date,
            },
          },
        );
        if (!AnotherUserActivForCheckDate) {
          let activity = await this.activityModel.findByPk(
            createUserActivityDto.activityId,
          );
          let [userActiv, created] = await this.userActivityModel.findOrCreate({
            where: {
              activityId: createUserActivityDto.activityId,
              userActivityName: activity.activity_name,
              date: createUserActivityDto.date,
            },
          });
          let user = await this.userModel.findOne({
            where: {
              id: data['id'],
            },
          });
          if (user.non_blacklist == true) {
            if (created) {
              console.log('create');
              userActiv.update({
                userId: [data['id']],
                picture_activity: activity.picture,
              });
              this.notificationModel.create({
                userId: data['id'],
                activityId: activity.id,
                detail: `คุณมีกิจกรรม ${activity.activity_name} ที่ต้องทำในวันที่ ${createUserActivityDto.date}`,
                date: createUserActivityDto.date,
                is_read: false,
              });
              return {
                message: 'Register success',
              };
            } else if (activity.size_number >= userActiv.userId.length) {
              console.log('push');
              if (
                !userActiv.userId.includes(data['id']) &&
                !AnotherUserActivForCheckDate
              ) {
                let allUser = [...userActiv.userId, data['id']];
                userActiv.update({ userId: allUser });
                this.notificationModel.create({
                  userId: data['id'],
                  detail: `คุณมีกิจกรรม ${activity.activity_name} ที่ต้องทำในวันที่ ${createUserActivityDto.date}`,
                  date: createUserActivityDto.date,
                  is_read: false,
                });
                return {
                  message: 'Register success',
                };
              } else {
                throw new HttpException(
                  'You already registered to this activity',
                  HttpStatus.BAD_REQUEST,
                );
              }
            } else {
              throw new BadRequestException('This event is full');
            }
          } else {
            throw new BadRequestException('black list');
          }
        } else {
          throw new HttpException(
            'You already have another activity this day',
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        throw new HttpException('Date out of range', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new BadRequestException('You are not loging in!!!');
    }

    return response;
  }

  async postComment(commentDto: CommentDto, request: Request) {
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    let user = await this.userModel.findByPk(data['id']);
    let activity = await this.activityModel.findByPk(commentDto.activityId);
    let userActiv = await this.userActivityModel.findOne({
      where: {
        id: commentDto.userActivityId,
        userId: { [Op.contains]: [data['id']] },
        activityId: commentDto.activityId,
      },
    });
    let comment_day = new Date();
    if (user && activity && userActiv && userActiv.is_ended == true) {
      let comment = this.commentModel.create({
        user_name: user.name,
        activity_name: activity.activity_name,
        comment_detail: commentDto.comment_detail,
        activity_date: userActiv.date,
        comment_date: comment_day,
        activityId: commentDto.activityId,
        userId: user.id,
      });
      return comment;
    } else {
      return {
        message: 'You can not comment this',
      };
    }
  }

  async getForCertify(
    request: Request,
    createUserActivityDto: CreateUserActivityDto,
  ) {
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    let userActiv = await this.userActivityModel.findOne({
      where: {
        userId: { [Op.contains]: [data['id']] },
        is_ended: true,
        id: createUserActivityDto.id,
      },
    });

    if (userActiv) {
      return userActiv;
    } else {
      return {
        message: 'You can not download this',
      };
    }
  }

  async updateConfirmedId(
    createUserActivityDto: CreateUserActivityDto,
    updateUserActivityDto: UpdateUserActivityDto,
    request: Request,
  ): Promise<any> {
    let response = new ResponseStandard();
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    if (data['id']) {
      let userActiv = await this.userActivityModel.findOne({
        where: {
          userId: { [Op.contains]: [data['id']] },
          date: createUserActivityDto.date,
          activityId: createUserActivityDto.activityId,
        },
      });
      let ucID = [...userActiv.userIdConfirmed, data['id']];
      let new_uID = userActiv.userId.filter((new_id) => new_id !== data['id']);
      await userActiv.update({ userId: new_uID, userIdConfirmed: ucID });
      return userActiv.userId.filter((new_id) => new_id !== data['id']);
    }
  }

  async cancelActivity(
    createUserActivityDto: CreateUserActivityDto,
    updateUserActivityDto: UpdateUserActivityDto,
    request: Request,
  ): Promise<any> {
    let response = new ResponseStandard();
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    if (data['id']) {
      console.log('test');
      let userActiv = await this.userActivityModel.findOne({
        where: {
          userId: { [Op.contains]: [data['id']] },
          date: createUserActivityDto.date,
          activityId: createUserActivityDto.activityId,
        },
      });
      if (userActiv) {
        console.log('test2');
        let date_now = new Date();
        let act_date = userActiv.date;
        let act_date_gen = new Date(act_date);
        act_date_gen.setDate(act_date_gen.getDate() - 1);
        // console.log(date_now);
        // console.log(act_date_gen);
        let date_check = date_now < act_date_gen;
        if (userActiv && !userActiv.is_started && date_check) {
          let new_uID = userActiv.userId.filter(
            (new_id) => new_id !== data['id'],
          );
          await userActiv.update({ userId: new_uID });
          this.notificationModel.destroy({
            where: {
              userId: [data['id']],
              date: createUserActivityDto.date,
              activityId: createUserActivityDto.activityId,
            },
          });
          return {
            message: 'Cancel success',
          };
        } else {
          throw new BadRequestException('You can not cancel This activity.');
        }
        return date_now.getDate() < act_date_gen.getDate();
      } else {
        throw new BadRequestException(
          'You are not registered to this activity.',
        );
      }
    }
  }

  async readNotify(notifyDto: NotifyDto) {
    let notify = await this.notificationModel.findByPk(notifyDto.id);
    if (notify && notify.is_read != true) {
      await notify.update({ is_read: true });
    }
  }

  async getUserActivity(
    createUserActivityDto: CreateUserActivityDto,
    request: Request,
  ) {
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    let userActiv = this.userActivityModel.findAll({
      where: {
        userId: { [Op.contains]: [data['id']] },
        is_ended: false,
      },
    });
    return userActiv;
  }

  async getEndedUserActivity(
    createUserActivityDto: CreateUserActivityDto,
    request: Request,
  ) {
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    let activity = this.activityModel.findAll({ include: [UserActivity] });
    let userActiv = this.userActivityModel.findAll({
      where: {
        userId: { [Op.contains]: [data['id']] },
        is_ended: true,
      },
    });
    return userActiv;
  }

  async getUserActivityName(
    createUserActivityDto: CreateUserActivityDto,
    request: Request,
  ) {
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    let userActiv = this.userActivityModel.findAll({
      where: {
        userId: { [Op.contains]: [data['id']] },
        is_ended: false,
      },
    });
    return userActiv;
  }

  async GetDataArray(
    createUserActivityDto: CreateUserActivityDto,
    request: Request,
  ) {
    let response = new ResponseStandard();
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);

    if (data['id']) {
      let userActivities = this.userActivityModel.findAll({
        where: {
          userId: { [Op.contains]: [data['id']] },
        },
        raw: true,
      });
      let test = (await userActivities).map((r) => {
        return r.userId;
      });
      let test2 = test[0].indexOf(data['id']);
      let test3 = test[0].splice(test2, 1);
      return test3;
      // return (await userActivities).map(r => {return r.userId})
      // return userActivities
    }
  }

  async updateUser(updateUserDto: UpdateUserDto, request: Request) {
    let response = new ResponseStandard();
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    let user = await this.userModel.findByPk(data['id']);
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

  async loginUser(
    loginUserDTo: LoginUserDto,
    response: Response,
  ): Promise<any> {
    let responseC = new ResponseStandard();
    let user = await this.userModel.findOne({
      where: { email: loginUserDTo.email },
    });
    const jwt = await this.jwtService.signAsync({ id: user.id });
    console.log(jwt);
    response.cookie('jwt', jwt, { httpOnly: false });
    const socket = io('http://localhost:3000', {
      query: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!user) {
      responseC.error_code = '400';
      responseC.error_message = 'Invalid User';
      throw new BadRequestException('Invalid User');
    }
    if (!(await bcrypt.compare(loginUserDTo.password, user.password))) {
      responseC.error_code = '400';
      responseC.error_message = 'Password not correct';
      throw new BadRequestException('Password not correct');
    } else {
      responseC.success = true;
      responseC.result = user;
    }
    return responseC;
  }

  async getUser(request: Request) {
    const cookie = request.cookies['jwt'];
    console.log(cookie);
    const data = await this.jwtService.verifyAsync(cookie);

    if (!data) {
      throw new UnauthorizedException('Dont have data');
    }
    const user = await this.userModel.findOne({ where: { id: data['id'] } });

    let userTest = JSON.parse(JSON.stringify(user));
    const { password, ...result } = userTest;

    return result;
  }

  async getRes(response: Response) {
    return response;
  }

  async logoutUser(response: Response) {
    response.clearCookie('jwt');

    return {
      message: 'success',
    };
  }

  async verifyEmail(token: string) {
    console.log('test');
    const user = await this.userModel.findOne({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      return { message: 'Invalid verification token' };
    }

    user.emailVerified = true;
    user.emailVerificationToken = null;
    await user.save();

    return { message: 'Email verification successful' };
  }

  async sendPasswordResetEmail(createUserDto: CreateUserDto) {
    const user = await this.userModel.findOne({
      where: { email: createUserDto.email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    user.generatePasswordResetToken();
    await user.save();

    await user.sendPasswordResetEmail();

    return { message: 'Password reset email sent' };
  }

  async resetPassword(token: string, createUserDto: CreateUserDto) {
    const user = await this.userModel.findOne({
      where: { passwordResetToken: token },
    });

    if (!user) {
      throw new NotFoundException('Invalid password reset token');
    } else if (user.emailVerified == true) {
      if (!createUserDto.password) {
        throw new BadRequestException('Password cannot be null or undefined');
      }
      const passwordHash = await bcrypt.hash(createUserDto.password, 12);
      createUserDto.password = passwordHash;
      await user.update({
        password: createUserDto.password,
        passwordResetToken: null,
      });

      return { message: 'Password reset successful' };
    } else {
      return { message: 'You are not verified email' };
    }
  }

  async getTest() {
    return this.userModel.findAll({ include: [Notification] });
    // return this.activityModel.findAll({include: [User]})
  }

  async getActivities() {
    return this.activityModel.findAll({});
  }

  async getOpenActivities() {
    let openActiv = this.activityModel.findAll({
      where: {
        is_open: true,
      },
    });
    return openActiv;
  }

  async confirmEmail(id: number) {
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

  private getTokenFromRequest(request: any): string | null {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return null;
  }

  async getUserToken(request: Request) {
    const cookie = request.cookies['jwt'];
    console.log(cookie);
    const data = await this.jwtService.verifyAsync(cookie);

    return data['id'];
  }

  async checkEmail(loginUserDTo: LoginUserDto) {
    let user = await this.userModel.findOne({
      where: { email: loginUserDTo.email },
    });
    if (user) {
      return {
        message: 'This e-mail is already used',
      };
    } else {
      return {
        message: 'You can use this e-mail',
      };
    }
  }

  @SubscribeMessage('events')
  async handleEventNotification(data: any, client: any) {
    console.log('test+++++++++++++++++++++++++++++++++++++');
    // console.log(this.jwtService.verify)

    const token = client.handshake.query.Authorization.split(' ')[1];

    console.log(token);

    // const request = context.switchToHttp().getRequest();
    // const cookie = request.cookies['jwt']
    // const cookie = this.request.cookies['jwt']
    // const cookie1 = this.getUserToken(request)
    // console.log(cookie1)

    // console.log(cookie)
    // if(cookie) {
    //   console.log('test')
    //   const dataUser = await this.jwtService.verifyAsync(cookie)
    //   if (dataUser['id']) {
    //     const events = await this.userActivity.findAll({
    //       where: {
    //         userId: {[Op.contains]:[dataUser['id']],},
    //         date: {
    //           [Op.gte]: new Date(),
    //           [Op.lt]: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    //         },
    //         canceled: false,
    //       },
    //     });
    //     let test1 = new Date()
    //     let test = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    //     console.log(test1)
    //     console.log(test)

    //     for (const event of events) {
    //       client.emit('event', event.toJSON());
    //     }
    //   }
    // }
  }
}
