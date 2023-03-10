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
import { UserActivitiesConfirmedModule } from './user-activities-confirmed/user-activities-confirmed.module';

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
          UserActivity
        ],
      }),
      inject: [ConfigService],
    }),
    
    SequelizeModule.forFeature([
      User, 
      Activity,
      UserActivity
    ]),
  UsersModule,
  ConfigModule.forRoot({
    isGlobal: true,
  }),
  ActivitiesModule,
  UserActivitiesModule,
  AdminsModule,
  TestModule,
  UserActivitiesConfirmedModule,
],
  providers: [AppService,AppGateway],
})
export class AppModule {}
