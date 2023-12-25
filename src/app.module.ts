import { logger } from '@1win/cdp-backend-tools';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

import { BotModule } from './bot/bot.module';
import config from './configuration/config';
import { HealthModule } from './health/health.module';
import { UpdatesModule } from './updates/updates.module';
import { GlobalExceptionFilter } from './utils/filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    HealthModule,
    UpdatesModule,
    BotModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(logger.LoggerMiddleware()).exclude('health').forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
