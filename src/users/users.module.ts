import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config/dist';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt/dist';
import { Activity } from 'src/activities/entities/activity.entity';
import { UserActivity } from 'src/user-activities/entities/user-activity.entity';
import { MulterModule } from '@nestjs/platform-express';
import { AppGateway } from './users.gateway';
import { File } from 'src/activities/entities/file.entity';
import { Comment } from 'src/activities/entities/comment.entity';
import { Notification } from './entities/notify.entity';
import { Rating } from 'src/activities/entities/reting.entity';
// import { PdfFile } from 'src/activities/entities/pdfFile.entity';

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
        dialectOptions: {
          ssl: {
            require: true
          }
        },
        autoLoadModels: true,
        synchronize: true,
        timezone: 'Asia/Bangkok',
        models: [
          User, 
          Activity,
          // PdfFile,
          UserActivity,
          File,
          Comment,
          Notification,
          Rating,
        ],
      }),
      inject: [ConfigService],
    }),
    
    SequelizeModule.forFeature([
      User, 
      Activity,
      // PdfFile,
      UserActivity,
      File,
      Comment,
      Notification,
      Rating,
    ]),
    JwtModule.register({
      secret: 'secret',
      signOptions: {expiresIn: '1w'}
    }),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, ConfigService, AppGateway],
})
export class UsersModule {}
