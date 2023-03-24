import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { Activity } from 'src/activities/entities/activity.entity';
import { UserActivity } from 'src/user-activities/entities/user-activity.entity';
import { JwtModule } from '@nestjs/jwt';
import { Admin } from './entities/admin.entity';
// import { PdfFile } from 'src/activities/entities/pdfFile.entity';
import { MulterModule } from '@nestjs/platform-express';
import { File } from 'src/activities/entities/file.entity';

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
          UserActivity,
          File,
          // PdfFile
        ],
      }),
      inject: [ConfigService],
    }),
    
    SequelizeModule.forFeature([
      User, 
      Activity,
      Admin,
      UserActivity,
      File,
      // PdfFile
    ]),
    JwtModule.register({
      secret: 'secret',
      signOptions: {expiresIn: '1w'}
    }),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [AdminsController],
  providers: [AdminsService]
})
export class AdminsModule {}
