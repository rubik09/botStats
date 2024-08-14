import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { makeCounterProvider, makeHistogramProvider } from '@willsoto/nestjs-prometheus';

import { PersonalInfo } from './entity/personalInfo.entity';
import { PersonalInfoController } from './personalInfo.controller';
import { PersonalInfoRepository } from './personalInfo.repository';
import { PersonalInfoService } from './personalInfo.service';
import { CounterMetricsConfig, HistogramMetricsConfig } from '../metrics/metrics.constant';

@Module({
  imports: [TypeOrmModule.forFeature([PersonalInfo])],
  providers: [
    PersonalInfoService,
    PersonalInfoRepository,
    makeCounterProvider(CounterMetricsConfig.DB_REQUEST_PERSONAL_INFO_TOTAL),
    makeHistogramProvider(HistogramMetricsConfig.DB_REQUEST_PERSONAL_INFO_DURATION),
  ],
  controllers: [PersonalInfoController],
  exports: [PersonalInfoService],
})
export class PersonalInfoModule {}
