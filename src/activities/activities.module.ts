import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { Activity } from './entities/activity.entity';
import { UserActivity } from 'src/user-activities/entities/user-activity.entity';
// import { PdfFile } from './entities/pdfFile.entity';
import { MulterModule } from '@nestjs/platform-express';
import { File } from './entities/file.entity';
import { JwtModule } from '@nestjs/jwt';
import { Comment } from './entities/comment.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { Notification } from 'src/users/entities/notify.entity';
import { Rating } from './entities/reting.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
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
  controllers: [ActivitiesController],
  providers: [ActivitiesService]
})
export class ActivitiesModule {}
