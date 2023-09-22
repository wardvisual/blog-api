import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';

import { configService } from '@/lib/services/env.service';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api/v1');

  app.enableCors();

  app.use('/public/assets', express.static('public/assets'));

  setupSwagger(app);

  await app.listen(configService.get<number>('APP_PORT'));
}

bootstrap();
