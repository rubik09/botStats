import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { makeCounterProvider, makeHistogramProvider } from '@willsoto/nestjs-prometheus';

import { Stat } from './entity/stats.entity';
import { StatsController } from './stats.controller';
import { StatsRepository } from './stats.repository';
import { StatsService } from './stats.service';
import { CalculatedStatsModule } from '../calculatedStats/calculatedStats.module';
import { KeywordsModule } from '../keywords/keywords.module';
import { CounterMetricsConfig, HistogramMetricsConfig } from '../metrics/metrics.constant';
import { UsersModule } from '../users/users.module';
import { UserSessionModule } from '../userSession/userSession.module';

@Module({
  imports: [TypeOrmModule.forFeature([Stat]), UserSessionModule, UsersModule, KeywordsModule, CalculatedStatsModule],
  providers: [
    StatsService,
    StatsRepository,
    makeCounterProvider(CounterMetricsConfig.DB_REQUEST_STATS_TOTAL),
    makeHistogramProvider(HistogramMetricsConfig.DB_REQUEST_STATS_DURATION),
  ],
  controllers: [StatsController],
  exports: [StatsService],
})
export class StatsModule {}
