import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { makeCounterProvider, makeHistogramProvider } from '@willsoto/nestjs-prometheus';

import { CalculatedStatsController } from './calculatedStats.controller';
import { CalculatedStatsRepository } from './calculatedStats.repository';
import { CalculatedStatsService } from './calculatedStats.service';
import { CalculatedStat } from './entity/calculatedStats.entity';
import { CounterMetricsConfig, HistogramMetricsConfig } from '../metrics/metrics.constant';

@Module({
  imports: [TypeOrmModule.forFeature([CalculatedStat])],
  providers: [
    CalculatedStatsService,
    CalculatedStatsRepository,

    makeCounterProvider(CounterMetricsConfig.DB_REQUEST_CALCULATED_STATS_TOTAL),
    makeHistogramProvider(HistogramMetricsConfig.DB_REQUEST_CALCULATED_STATS_DURATION),
  ],
  controllers: [CalculatedStatsController],
  exports: [CalculatedStatsService],
})
export class CalculatedStatsModule {}
