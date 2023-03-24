import { JwtService } from '@nestjs/jwt';
import { InjectModel, InjectConnection } from '@nestjs/sequelize';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserActivity } from 'src/user-activities/entities/user-activity.entity';
import { Response, Request } from 'express';
import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, Query, Sse, Inject, UseGuards } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
const { Op } = require("sequelize");

@WebSocketGateway()
export class AppGateway {
  @WebSocketServer() server: Server;

  // constructor(
  //   @InjectModel(UserActivity) 
  //   private userActivity: typeof UserActivity,
  //   private jwtService: JwtService,
  //   // @Inject(REQUEST) private readonly request: Request,
  //   ) {
  //   this.server = new Server();
  // }
  // // @UseGuards(AuthGuard)
  // @SubscribeMessage('events')
  // async handleEventNotification(client: any, data: any,request: Request) {
  //   const cookie = request.cookies['jwt']
  //   if(cookie) {
  //     console.log('test')
  //     const dataUser = await this.jwtService.verifyAsync(cookie)
  //     if (dataUser['id']) {
  //       const events = await this.userActivity.findAll({
  //         where: {
  //           userId: {[Op.contains]:[dataUser['id']],},
  //           date: {
  //             [Op.gte]: new Date(),
  //             [Op.lt]: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  //           },
  //           canceled: false,
  //         },
  //       });
  //       let test1 = new Date()
  //       let test = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  //       console.log(test1)
  //       console.log(test)
      

  //       for (const event of events) {
  //         client.emit('event', event.toJSON());
  //       }
  //     }
  //   }
  // }
}