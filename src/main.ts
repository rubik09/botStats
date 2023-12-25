import { logger } from '@1win/cdp-backend-tools';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { ClsServiceManager } from 'nestjs-cls';

import { AppModule } from './app.module';

async function bootstrap() {
  const config = new ConfigService();
  const csl = ClsServiceManager.getClsService();

  const app = await NestFactory.create(AppModule, {
    logger: new logger.LoggerService(csl, {
      logLevel: config.get('LOG_LEVEL'),
      logPretty: config.get('LOG_PRETTY')?.toLowerCase().startsWith('true'),
    }),
  });

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

  const API_PREFIX = configService.get('API_PREFIX');
  const API_VERSION = configService.get('API_VERSION');
  app.setGlobalPrefix(`${API_PREFIX}${API_VERSION}`);

  const HTTP_PORT = configService.get('HTTP_PORT');

  app.use(helmet());

  await app.listen(HTTP_PORT);
}
bootstrap();
