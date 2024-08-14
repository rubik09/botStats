import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { makeCounterProvider, makeHistogramProvider } from '@willsoto/nestjs-prometheus';

import { CronController } from './cron.controller';
import { CronRepository } from './cron.repository';
import { CronService } from './cron.service';
import { CronEntity } from './entity/cron.entity';
import { CounterMetricsConfig, HistogramMetricsConfig } from '../metrics/metrics.constant';
import { StatsModule } from '../stats/stats.module';

@Module({
  imports: [TypeOrmModule.forFeature([CronEntity]), StatsModule],
  providers: [
    CronService,
    CronRepository,

    makeCounterProvider(CounterMetricsConfig.DB_REQUEST_CRON_TOTAL),
    makeHistogramProvider(HistogramMetricsConfig.DB_REQUEST_CRON_DURATION),
  ],
  controllers: [CronController],
})
export class CronModule {}
