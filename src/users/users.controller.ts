import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, Query } from '@nestjs/common';
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

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
                        @Req() request: Request) {
    return this.usersService.postUserActivities2(createUserActivityDto,checkUserDto,request);
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

  @Get('/confirm/:id')
  confirmEmail(@Param() id:number) {
    return this.usersService.confirmEmail(id)
  }

  @Get('/verify-email')
  verifyEmail(@Query('token') token: string) {
    return this.usersService.verifyEmail(token)
  }

  @Post('/reset-password')
  resetPassword(@Body() createUserDto: CreateUserDto) {
    return this.usersService.resetPassword(createUserDto)
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
