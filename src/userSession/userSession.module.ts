import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { makeCounterProvider, makeHistogramProvider } from '@willsoto/nestjs-prometheus';

import { UserSession } from './entity/userSession.entity';
import { UserSessionController } from './userSession.controller';
import { UserSessionRepository } from './userSession.repository';
import { UserSessionService } from './userSession.service';
import { BotAlertModule } from '../botAlert/botAlert.module';
import { CounterMetricsConfig, HistogramMetricsConfig } from '../metrics/metrics.constant';
import { PersonalInfoModule } from '../personalInfo/personalInfo.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserSession]), PersonalInfoModule, BotAlertModule],
  providers: [
    UserSessionService,
    UserSessionRepository,
    makeCounterProvider(CounterMetricsConfig.DB_REQUEST_USER_SESSION_TOTAL),
    makeHistogramProvider(HistogramMetricsConfig.DB_REQUEST_USER_SESSION_DURATION),
  ],
  controllers: [UserSessionController],
  exports: [UserSessionRepository, UserSessionService],
})
export class UserSessionModule {}
