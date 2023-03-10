import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser())
  app.enableCors({
    origin: true,
    credentials: true,
    allowedHeaders: 'Content-Type, Accept'
  })

  await app.listen(8000);
}
bootstrap();
