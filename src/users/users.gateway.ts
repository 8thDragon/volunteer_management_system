import { InjectModel } from '@nestjs/sequelize';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UserActivity } from 'src/user-activities/entities/user-activity.entity';

@WebSocketGateway()
export class AppGateway {
  @WebSocketServer() server: Server;

  constructor(@InjectModel(UserActivity) private userActivity: typeof UserActivity) {
    this.server = new Server();
  }

  @SubscribeMessage('events')
  async handleEventNotification(client: any, data: any): Promise<void> {
    const events = await this.userActivity.findAll({
      where: {
        date: {
          $gte: new Date(),
          $lt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        },
        canceled: false,
      },
    });

    for (const event of events) {
      client.emit('event', event.toJSON());
    }
  }
}