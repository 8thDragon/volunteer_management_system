// import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
// import { MessageBody } from '@nestjs/websockets/decorators/message-body.decorator';
// import { Server } from 'socket.io';
// import { OnModuleInit } from '@nestjs/common'

// @WebSocketGateway()
// export class UserActivityGateway implements OnModuleInit {

//   @WebSocketServer()
//   server: Server

//   onModuleInit() {
//     this.server.on('connection', (socket) => {
//       console.log(socket.id)
//       console.log('Connected')
//     })
//   }

//   @SubscribeMessage('message')
//   handleMessage(@MessageBody() body: any){
//     console.log(body)
//     this.server.emit('message', {
//       msg: 'New message',
//       content: body,
//     })
//   }
// }
