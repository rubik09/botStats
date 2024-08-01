import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { makeCounterProvider, makeHistogramProvider } from '@willsoto/nestjs-prometheus';

import { PersonalInfo } from './entity/personalInfo.entity';
import { PersonalInfoController } from './personalInfo.controller';
import { PersonalInfoRepository } from './personalInfo.repository';
import { PersonalInfoService } from './personalInfo.service';
import { MetricHelp, MetricLabels, MetricNames } from '../metrics/metrics.constant';

@Module({
  imports: [TypeOrmModule.forFeature([PersonalInfo])],
  providers: [
    PersonalInfoService,
    PersonalInfoRepository,
    makeCounterProvider({
      name: MetricNames.DB_REQUEST_PERSONAL_INFO_TOTAL,
      help: MetricHelp.DB_REQUEST_PERSONAL_INFO_TOTAL_HELP,
      labelNames: [MetricLabels.METHOD],
    }),
    makeHistogramProvider({
      name: MetricNames.DB_REQUEST_PERSONAL_INFO_DURATION,
      help: MetricHelp.DURATION_DB_REQUEST_PERSONAL_INFO_HELP,
      labelNames: [MetricLabels.METHOD, MetricLabels.STATUS],
      buckets: [0.1, 0.5, 1, 3, 5, 10],
    }),
  ],
  controllers: [PersonalInfoController],
  exports: [PersonalInfoService],
})
export class PersonalInfoModule {}
