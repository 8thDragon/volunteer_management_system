import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { Response, Request } from 'express';
import { CheckUserDto } from 'src/users/dto/check-user.dto';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post('create_admin')
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.createAdmin(createAdminDto);
  }

  @Patch('update_user_status')
  async updateUserStatus(@Body() checkUserDto: CheckUserDto,
                        @Req() request: Request) {
    return this.adminsService.updateUserStatus(checkUserDto,request)
  }

  @Get()
  findAll() {
    return this.adminsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminsService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminsService.remove(+id);
  }
}
