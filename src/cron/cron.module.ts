import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { makeCounterProvider, makeHistogramProvider } from '@willsoto/nestjs-prometheus';

import { CronController } from './cron.controller';
import { CronRepository } from './cron.repository';
import { CronService } from './cron.service';
import { CronEntity } from './entity/cron.entity';
import { MetricHelp, MetricLabels, MetricNames } from '../metrics/metrics.constant';
import { StatsModule } from '../stats/stats.module';

@Module({
  imports: [TypeOrmModule.forFeature([CronEntity]), StatsModule],
  providers: [
    CronService,
    CronRepository,
    makeCounterProvider({
      name: MetricNames.DB_REQUEST_CRON_TOTAL,
      help: MetricHelp.DB_REQUEST_CRON_TOTAL_HELP,
      labelNames: [MetricLabels.METHOD],
    }),
    makeHistogramProvider({
      name: MetricNames.DB_REQUEST_CRON_DURATION,
      help: MetricHelp.DURATION_DB_REQUEST_CRON_HELP,
      labelNames: [MetricLabels.METHOD, MetricLabels.STATUS],
      buckets: [0.1, 0.5, 1, 3, 5, 10],
    }),
  ],
  controllers: [CronController],
})
export class CronModule {}
