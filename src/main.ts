import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { join } from 'path';
import express = require("express");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe())
  app.use('/public', express.static(join(__dirname, '../..', 'uploadedFiles/files')));
  app.enableCors({
    origin: true,
    credentials: true,
    allowedHeaders: 'Content-Type, Accept'
  })
  console.log('+++++++++++++++++',join(__dirname, '../..', 'uploadedFiles/files'))

  await app.listen(8000);
}
bootstrap();
