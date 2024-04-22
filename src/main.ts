import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        return errors;
      },
    }),
  );

  const configService = app.get(ConfigService);

  const API_PREFIX = configService.getOrThrow('API_PREFIX');
  const API_VERSION = configService.getOrThrow('API_VERSION');
  app.setGlobalPrefix(`${API_PREFIX}${API_VERSION}`);

  const HTTP_PORT = configService.getOrThrow('HTTP_PORT');

  app.use(helmet());

  const port = Number(HTTP_PORT) || 8000;
  await app.listen(port, () => {
    console.log(`🚀 Server listening ${port} `);
  });
}

bootstrap();
