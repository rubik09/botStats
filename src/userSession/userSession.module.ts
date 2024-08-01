import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { makeCounterProvider, makeHistogramProvider } from '@willsoto/nestjs-prometheus';

import { UserSession } from './entity/userSession.entity';
import { UserSessionController } from './userSession.controller';
import { UserSessionRepository } from './userSession.repository';
import { UserSessionService } from './userSession.service';
import { BotAlertModule } from '../botAlert/botAlert.module';
import { MetricHelp, MetricLabels, MetricNames } from '../metrics/metrics.constant';
import { PersonalInfoModule } from '../personalInfo/personalInfo.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserSession]), PersonalInfoModule, BotAlertModule],
  providers: [
    UserSessionService,
    UserSessionRepository,
    makeCounterProvider({
      name: MetricNames.DB_REQUEST_USER_SESSION_TOTAL,
      help: MetricHelp.DB_REQUEST_USER_SESSION_TOTAL_HELP,
      labelNames: [MetricLabels.METHOD],
    }),
    makeHistogramProvider({
      name: MetricNames.DB_REQUEST_USER_SESSION_DURATION,
      help: MetricHelp.DURATION_DB_REQUEST_USER_SESSION_HELP,
      labelNames: [MetricLabels.METHOD, MetricLabels.STATUS],
      buckets: [0.1, 0.5, 1, 3, 5, 10],
    }),
  ],
  controllers: [UserSessionController],
  exports: [UserSessionRepository, UserSessionService],
})
export class UserSessionModule {}
