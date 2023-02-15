import { AppService } from './app.service';
import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import * as bcrypt from 'bcrypt'

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @Post('register')
  // async register(
  //   @Body('name') name: string,
  //   @Body('email') email: string,
  //   @Body('password') password: string
  //   ) {
  //     const hashPassword = await bcrypt.hash(password,12);

  //     return this.appService.create({
  //       name,
  //       email,
  //       password: hashPassword
  //     });
  // }

}
