import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminsModule } from './admins/admins.module';
import { CalculatedStatsModule } from './calculatedStats/calculatedStats.module';
import config from './configuration/config';
import { CronModule } from './cron/cron.module';
import { BotAlertModule } from './botAlert/botAlert.module';
import { HealthModule } from './health/health.module';
import { KafkaModule } from './kafka/kafka.module';
import { VerificationConsumer } from './kafka/verification.consumer';
import { KeywordsModule } from './keywords/keywords.module';
import { MetricsInterceptor } from './metrics/metrics.interceptor';
import { MetricsModule } from './metrics/metrics.module';
import { PersonalInfoModule } from './personalInfo/personalInfo.module';
import { StatsModule } from './stats/stats.module';
import { TelegramConnectModule } from './telegramConnect/telegramConnect.module';
import { UsersModule } from './users/users.module';
import { UserSessionModule } from './userSession/userSession.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ScheduleModule.forRoot(),
    HealthModule,
    AdminsModule,
    UserSessionModule,
    StatsModule,
    UsersModule,
    PersonalInfoModule,
    TelegramConnectModule,
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => configService.getOrThrow('POSTGRES_DB_SETTINGS'),
      inject: [ConfigService],
    }),
    PersonalInfoModule,
    TelegramConnectModule,
    KafkaModule,
    KeywordsModule,
    CalculatedStatsModule,
    CronModule,
    BotAlertModule,
    MetricsModule,
  ],
  providers: [
    VerificationConsumer,
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().exclude('health').forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
