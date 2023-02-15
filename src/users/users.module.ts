import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config/dist';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt/dist';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        autoLoadModels: true,
        synchronize: true,
        timezone: 'Asia/Bangkok',
        models: [
          User
        ],
      }),
      inject: [ConfigService],
    }),

    SequelizeModule.forFeature([
      User
    ]),
    JwtModule.register({
      secret: 'secret',
      signOptions: {expiresIn: '1w'}
    })
  ],
  controllers: [UsersController],
  providers: [UsersService, ConfigService]
})
export class UsersModule {}
