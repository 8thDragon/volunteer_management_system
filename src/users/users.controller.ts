import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Response, Request } from 'express';
import { CreateActivityDto } from 'src/activities/dto/create-activity.dto';
import { CreateUserActivityDto } from 'src/user-activities/dto/create-user-activity.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto : CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDTo : LoginUserDto,
              @Res({passthrough: true}) response : Response) {
    return this.usersService.getUserByEmail(loginUserDTo,response)
  }

  @Post('logout')
  async logout(@Res({passthrough: true}) response : Response) {
    return this.usersService.logoutUser(response)
  }

  @Get('user')
  async user(@Req() request: Request) {
    return this.usersService.getUser(request)
  }

  @Get('test')
  async getTest() {
    return this.usersService.getTest()
  }

  @Post('dateAc')
  async postActivities(@Body() createUserActivityDto : CreateUserActivityDto) {
    return this.usersService.postUserActivities(createUserActivityDto);
  }

  @Post('dateAc2')
  async postActivities2(@Body() createUserActivityDto : CreateUserActivityDto,
                        @Req() request: Request) {
    return this.usersService.postUserActivities2(createUserActivityDto,request);
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

  @Get('/vreify-email')
  verifyEmail(@Query('token') token: string) {
    return this.usersService.verifyEmail(token)
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
