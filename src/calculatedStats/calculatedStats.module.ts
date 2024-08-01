import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { makeCounterProvider, makeHistogramProvider } from '@willsoto/nestjs-prometheus';

import { CalculatedStatsController } from './calculatedStats.controller';
import { CalculatedStatsRepository } from './calculatedStats.repository';
import { CalculatedStatsService } from './calculatedStats.service';
import { CalculatedStat } from './entity/calculatedStats.entity';
import { MetricHelp, MetricLabels, MetricNames } from '../metrics/metrics.constant';

@Module({
  imports: [TypeOrmModule.forFeature([CalculatedStat])],
  providers: [
    CalculatedStatsService,
    CalculatedStatsRepository,
    makeCounterProvider({
      name: MetricNames.DB_REQUEST_CALCULATED_STATS_TOTAL,
      help: MetricHelp.DB_REQUEST_CALCULATED_STATS_TOTAL_HELP,
      labelNames: [MetricLabels.METHOD],
    }),
    makeHistogramProvider({
      name: MetricNames.DB_REQUEST_CALCULATED_STATS_DURATION,
      help: MetricHelp.DURATION_DB_REQUEST_CALCULATED_STATS_HELP,
      labelNames: [MetricLabels.METHOD, MetricLabels.STATUS],
      buckets: [0.1, 0.5, 1, 3, 5, 10],
    }),
  ],
  controllers: [CalculatedStatsController],
  exports: [CalculatedStatsService],
})
export class CalculatedStatsModule {}
