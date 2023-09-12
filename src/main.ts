import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';

import { configService } from '@/lib/services/env.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api/v1');

  app.use('/public/assets', express.static('public/assets'));

  await app.listen(configService.get<number>('APP_PORT'));
}

bootstrap();
