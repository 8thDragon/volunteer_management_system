import { OnGatewayInit, WebSocketGateway } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class AppGateway implements OnGatewayInit {
  private readonly server: Server;

  constructor() {
    this.server = new Server();
  }

  afterInit(server: Server) {
    setInterval(() => {
      // check the time and emit a notification to the connected clients
      const currentTime = new Date();
      const notificationTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now
      if (currentTime >= notificationTime) {
        this.server.emit('notification', 'You will be notified before 1 day.');
      }
    }, 1000);
  }
}