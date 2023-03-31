import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ActivitiesModule } from './activities/activities.module';
import { UserActivitiesModule } from './user-activities/user-activities.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/entities/user.entity';
import { Activity } from './activities/entities/activity.entity';
import { UserActivity } from './user-activities/entities/user-activity.entity';
import { AdminsModule } from './admins/admins.module';
import { AppGateway } from './users/users.gateway';
import { TestModule } from './test/test.module';
import { Admin } from './admins/entities/admin.entity';
// import { PdfFile } from './activities/entities/pdfFile.entity';
import { MulterModule } from '@nestjs/platform-express';
// import { GatewayModule } from './user-activity/user-activity.module';
// import { UserActivityGateway } from './user-activity/user-activity.gateway';
// import { SocketModule } from './socket/socket.module';
import { JwtModule } from '@nestjs/jwt';
import { File } from './activities/entities/file.entity';
import { Comment } from './activities/entities/comment.entity';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        autoLoadModels: true,
        synchronize: true,
        timezone: 'Asia/Bangkok',
        models: [
          User, 
          Activity,
          Admin,
          // PdfFile,
          UserActivity,
          File,
          Comment,
        ],
      }),
      inject: [ConfigService],
    }),
    JwtModule.register({
      secret: 'secret',
      signOptions: {expiresIn: '1w'}
    }),
    
    SequelizeModule.forFeature([
      User, 
      Activity,
      Admin,
      UserActivity,
      File,
      Comment,
      // PdfFile
    ]),
  UsersModule,
  ConfigModule.forRoot({
    isGlobal: true,
  }),
  MulterModule.register({
    dest: './uploads',
  }),
  ActivitiesModule,
  UserActivitiesModule,
  AdminsModule,
  TestModule,
  // SocketModule
],
  providers: [AppService,AppGateway, 
    // SocketModule
  ],
})
export class AppModule {}
