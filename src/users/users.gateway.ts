import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UserActivity } from 'src/user-activities/entities/user-activity.entity';
import { Response, Request } from 'express';
const { Op } = require("sequelize");

@WebSocketGateway()
export class AppGateway {
  @WebSocketServer() server: Server;

  constructor(
    @InjectModel(UserActivity) 
    private userActivity: typeof UserActivity,
    private jwtService: JwtService,) {
    this.server = new Server();
  }

  @SubscribeMessage('events')
  async handleEventNotification(client: any, data: any, request: Request) {
    // const cookie = request.cookies['jwt']
    // const dataUser = await this.jwtService.verifyAsync(cookie)
    // if (dataUser['id']) {
      const events = await this.userActivity.findAll({
        where: {
          // userId: {[Op.contains]:[dataUser['id']],},
          date: {
            [Op.gte]: new Date(),
            [Op.lt]: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
          },
          canceled: false,

        },
      });
      let test1 = new Date()
      let test = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
      console.log(test1)
      console.log(test)
    

      for (const event of events) {
        client.emit('event', event.toJSON());
      }
    // }
  }
}