import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

import { HttpExceptionFilter } from '@/lib/filters/http-exception.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app: INestApplication =
    await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}

bootstrap();
