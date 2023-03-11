import { Injectable } from '@nestjs/common';
import { ResponseStandard } from 'utilities/responseStandardApi';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from './entities/admin.entity';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { CheckUserDto } from 'src/users/dto/check-user.dto';
import { Activity } from 'src/activities/entities/activity.entity';

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(Admin)
    private adminModel: typeof Admin,
    private jwtService: JwtService,
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Activity)
    private activityModel: typeof Activity,
) {}
  async createAdmin(createAdminDto: CreateAdminDto) {
    let response = new ResponseStandard()
    const passwordHash = await bcrypt.hash(createAdminDto.password,12);
    createAdminDto.password = passwordHash
    let admin = await this.adminModel.create({...createAdminDto})
    let userTest = JSON.parse(JSON.stringify(admin));
    const {password, ...result} = userTest
    if (!admin) {
      response.error_code = "400"
      response.error_message = "Create User Failed"
    } else {
      response.success = true
      response.result = admin
    }
    return result
  }

  async updateUserStatus(checkUserDto: CheckUserDto, request: Request) {
    let response = new ResponseStandard()
    const cookie = request.cookies['jwt']
    const data = await this.jwtService.verifyAsync(cookie)
    let user = await this.userModel.findOne({where : {
      id: checkUserDto.id,
      name: checkUserDto.name
    }})
    if (!user) {
        response.success = false;
        response.error_code = '404';
        response.error_message = 'Account Not Found';
        return response;
    } else if(user.non_blacklist == true) {
      await user.update({non_blacklist: false})
      response.success = true;
    } else {
      await user.update({non_blacklist: true})
    }
    return user;
  }

  findAll() {
    return `This action returns all admins`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
