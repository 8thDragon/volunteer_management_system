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

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private jwtService: JwtService
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

  findAll() {
    return `This action returns all users`;
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
