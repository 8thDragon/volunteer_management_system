import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { ResponseStandard } from 'utilities/responseStandardApi';
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from './dto/login-user.dto';
import { where } from 'sequelize';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { Activity } from 'src/activities/entities/activity.entity';
import { UserActivity } from 'src/user-activities/entities/user-activity.entity';
import { CreateActivityDto } from 'src/activities/dto/create-activity.dto';
import { CreateUserActivityDto } from 'src/user-activities/dto/create-user-activity.dto';
// import { CreateActivityDto } from './dto/create-activity.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private jwtService: JwtService,
    @InjectModel(Activity)
    private activityModel: typeof Activity,
    @InjectModel(UserActivity)
    private userActivityModel: typeof UserActivity,
) {}
  async createUser(createUserDto : CreateUserDto) {
    let response = new ResponseStandard()
    const passwordHash = await bcrypt.hash(createUserDto.password,12);
    createUserDto.password = passwordHash
    let user = await this.userModel.create({...createUserDto})
    let userTest = JSON.parse(JSON.stringify(user));
    const {password, ...result} = userTest
    if (!user) {
      response.error_code = "400"
      response.error_message = "Create Blog Category Failed"
    } else {
      response.success = true
      response.result = user
    }
    return result
  }
  
  async postUserActivities(createUserActivityDto : CreateUserActivityDto) {
    let response = new ResponseStandard()
    let [userActiv, created] = await this.userActivityModel.findOrCreate({ where: {
      userId: createUserActivityDto.userId,
      activityId: createUserActivityDto.activityId,
      } })
    
    console.log(createUserActivityDto.date,typeof createUserActivityDto.date)
    console.log(userActiv.date,typeof userActiv.date)
    if (created) {
      userActiv.update({date: [createUserActivityDto.date]})
      response.success = true
      response.result = userActiv
    } else {
      if (!(userActiv.date.includes(createUserActivityDto.date))) {
        let allDate = [...userActiv.date,createUserActivityDto.date]
        userActiv.update({date: allDate})
      }
      response.result = userActiv
    }

    return response
  }

  async postUserActivities2(createUserActivityDto: CreateUserActivityDto,request: Request) {
    let response = new ResponseStandard()
    const cookie = request.cookies['jwt']
    const data = await this.jwtService.verifyAsync(cookie)
    if (data['id']) {
      let [userActiv, created] = await this.userActivityModel.findOrCreate({ where: {
        userId: data['id'],
        activityId: createUserActivityDto.activityId,
        } })
      
      console.log(createUserActivityDto.date,typeof createUserActivityDto.date)
      console.log(userActiv.date,typeof userActiv.date)
      if (created) {
        userActiv.update({date: [createUserActivityDto.date]})
        response.success = true
        response.result = userActiv
      } else {
        if (!(userActiv.date.includes(createUserActivityDto.date))) {
          let allDate = [...userActiv.date,createUserActivityDto.date]
          userActiv.update({date: allDate})
        }
        response.result = userActiv
      }
    } else {
      throw new BadRequestException('You are not loging in!!!')
    }

    return response
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

  async getUserByEmail(loginUserDTo : LoginUserDto, response : Response): Promise<any> {
    let responseC = new ResponseStandard()
    let user = await this.userModel.findOne({where: {email: loginUserDTo.email}})
    const jwt = await this.jwtService.signAsync({id: user.id})
    response.cookie('jwt', jwt, {httpOnly: true})

    if (!user) {
        responseC.error_code = "400"
        responseC.error_message = "Blog Category Not Found"
        throw new BadRequestException('Invalid User')
    } 
    if (!await bcrypt.compare(loginUserDTo.password, user.password)) {
      responseC.error_code = "400"
      responseC.error_message = "Blog Category Not Found"
      throw new BadRequestException('Password not correct')
    }
    else {
        responseC.success = true
        responseC.result = user
    }
    return jwt
  }

  async getUser(request: Request) {
    try {
      const cookie = request.cookies['jwt']
      const data = await this.jwtService.verifyAsync(cookie)

      if(!data) {
        throw new UnauthorizedException('Dont have data')
      }
      const user = await this.userModel.findOne({where: {id: data['id']}})

      let userTest = JSON.parse(JSON.stringify(user));
      const {password, ...result} = userTest

      return result
    } catch (e) {
      throw new UnauthorizedException()
    }
  }

  async logoutUser(response : Response) {
    response.clearCookie('jwt')

    return {
      message: 'success'
    }
  }

  async getTest() {
    return this.userModel.findAll({include: [Activity]})
    // return this.activityModel.findAll({include: [User]})
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
