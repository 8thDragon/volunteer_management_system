import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, Query, Sse, ExecutionContext } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Response, Request } from 'express';
import { CreateActivityDto } from 'src/activities/dto/create-activity.dto';
import { CreateUserActivityDto } from 'src/user-activities/dto/create-user-activity.dto';
import { MessageBody, SubscribeMessage } from '@nestjs/websockets/decorators';
import { UpdateUserActivityDto } from 'src/user-activities/dto/update-user-activity.dto';
import { CheckUserDto } from './dto/check-user.dto';
import { interval, map, Observable, of } from 'rxjs';
import { Injectable, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UserActivity } from 'src/user-activities/entities/user-activity.entity';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { AppGateway } from './users.gateway';
import { REQUEST } from '@nestjs/core';
import { ConnectedSocket } from '@nestjs/websockets/decorators/connected-socket.decorator';
import { Socket } from 'socket.io';
import { CommentDto } from 'src/activities/dto/commnet.dto';
import { NotifyDto } from 'src/activities/dto/notify.dto';
const { Op } = require("sequelize");

interface MessageEvent {
  data: string | object
}
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
              @Inject(AppGateway) private readonly appGateWay: AppGateway,
              @InjectModel(UserActivity) 
              private userActivity: typeof UserActivity,
              private jwtService: JwtService,
              @Inject('REQUEST') private readonly request: Request,) {}

  @SubscribeMessage('notification')
  handleNotification(@MessageBody() message: string) {
    console.log(message);
    // handle the notification
  }

  @Post('register')
  async register(@Body() createUserDto : CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  // @Post('login')
  // async login(@Body() loginUserDTo : LoginUserDto) {
  //   return this.usersService.getUserByEmail(loginUserDTo)
  // }

  @Post('post_comment')
  async postComment(@Body() commentDto: CommentDto,
                    @Req() request: Request) {
    return this.usersService.postComment(commentDto,request)
  }

  @Post('login')
  async login(@Body() loginUserDTo : LoginUserDto,
              @Res({passthrough: true}) response : Response) {
    return this.usersService.loginUser(loginUserDTo, response)
  }

  @Post('logout')
  async logout(@Res({passthrough: true}) response : Response) {
    return this.usersService.logoutUser(response)
  }

  @Get('user')
  async user(@Req() request: Request) {
    return this.usersService.getUser(request)
  }

  @Get('activities')
  async activities() {
    return this.usersService.getActivities()
  }

  @Post('certify')
  async getForCertify(@Req() request: Request,
                      @Body() createUserActivityDto: CreateUserActivityDto) {
    return this.usersService.getForCertify(request,createUserActivityDto)
  }

  @Get('res')
  async res(@Res({passthrough: true}) response : Response) {
    return this.usersService.getRes(response)
  }

  @Get('test')
  async getTest() {
    return this.usersService.getTest()
  }

  // @Post('dateAc')
  // async postActivities(@Body() createUserActivityDto : CreateUserActivityDto) {
  //   return this.usersService.postUserActivities(createUserActivityDto);
  // }

  @Post('dateAc2')
  async postActivities2(@Body() createUserActivityDto : CreateUserActivityDto,
                        @Body() checkUserDto : CheckUserDto,
                        @Body() createActivityDto: CreateActivityDto,
                        @Req() request: Request) {
    return this.usersService.postUserActivities2(createUserActivityDto,checkUserDto,createActivityDto,request);
  }

  @Get('get_data_array')
  async GetDataArray(@Body() createUserActivityDto: CreateUserActivityDto,
                    @Req() request: Request) {
    return this.usersService.GetDataArray(createUserActivityDto,request)
  }

  @Patch('update_confirmed_id')
  async updateConfirmedId(@Body() createUserActivityDto: CreateUserActivityDto,
                          @Body() updateUserActivityDto: UpdateUserActivityDto,
                          @Req() request: Request) {
    return this.usersService.updateConfirmedId(createUserActivityDto, updateUserActivityDto, request)                    
  }

  @Get('get-useractivity')
  async getUserActivity(@Body() createUserActivityDto: CreateUserActivityDto,
                        @Req() request: Request) {
    return this.usersService.getUserActivity(createUserActivityDto,request)
  }

  @Get('get-ended-useractivity')
  async getEndedUserActivity(@Body() createUserActivityDto: CreateUserActivityDto,
                            @Req() request: Request) {
    return this.usersService.getEndedUserActivity(createUserActivityDto,request)
  }

  @Get('get-open-activity')
  async getOpenActivities(){
    return this.usersService.getOpenActivities()
  }

  @Patch('read_notify')
  async readNotify(@Body() notifyDto: NotifyDto) {
    return this.usersService.readNotify(notifyDto)
  }

  @Patch('cancel_activity')
  async cancelActivity(@Body() createUserActivityDto: CreateUserActivityDto,
                          @Body() updateUserActivityDto: UpdateUserActivityDto,
                          @Req() request: Request) {
    return this.usersService.cancelActivity(createUserActivityDto, updateUserActivityDto, request)                    
  }

  @Patch('update_user')
  updateUser(@Req() request: Request,
              @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(updateUserDto, request);
  }

  // @SubscribeMessage('events')
  // async handleEventNotification(client: any, request: Request) {
  //   console.log('test controller')
  //   return this.usersService.handleEventNotification(client, request)
  // }

  // @SubscribeMessage('events')
  // async handleEventNotification(client: any, payload: any) {
  //   console.log('test')
  //   const cookie = this.request.cookies['jwt']
  //   console.log(cookie)
  //   if(false) {
  //     console.log('test')
  //     const dataUser = await this.jwtService.verifyAsync(cookie)
  //     if (dataUser['id']) {
  //       const events = await this.userActivity.findAll({
  //         where: {
  //           userId: {[Op.contains]:[dataUser['id']],},
  //           date: {
  //             [Op.gte]: new Date(),
  //             [Op.lt]: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  //           },
  //           canceled: false,
  //         },
  //       });
  //       let test1 = new Date()
  //       let test = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  //       console.log(test1)
  //       console.log(test)
      

  //       for (const event of events) {
  //         client.emit('event', event.toJSON());
  //       }
  //     }
  //   }
  // }

  @Get('/confirm/:id')
  confirmEmail(@Param() id:number) {
    return this.usersService.confirmEmail(id)
  }

  @Get('/verify-email')
  verifyEmail(@Query('token') token: string) {
    return this.usersService.verifyEmail(token)
  }

  @Post('/password-reset')
  sendPasswordResetEmail(@Body() createUserDto: CreateUserDto) {
    return this.usersService.sendPasswordResetEmail(createUserDto)
  }

  @Post('/reset-password')
  resetPassword(@Query('token') token: string,
                @Body() createUserDto: CreateUserDto) {
    return this.usersService.resetPassword(token, createUserDto)
  }


  @Sse('/event')
  sendEvent(): Observable<MessageEvent> {
    return interval(1000).pipe(map((num: number) => ({
      data: 'hello ' + num
    })))
  }

  @Sse('/event2')
  sendEvent2() {
    return of({ data: 'Hello World!' });
  }




  // @Get('activity')
  // async activity() {

  // }

  // @Post('createActivity')
  // async createActivity(@Body() createActivityDto : CreateActivityDto) {
  //   return this.usersService.createActivity(createActivityDto);
  // }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
