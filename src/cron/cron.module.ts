import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';

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
      help: MetricHelp.DB_REQUEST_CRON_TOTAL,
      labelNames: [MetricLabels.METHOD],
    }),
  ],
  controllers: [CronController],
})
export class CronModule {}
