import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { makeCounterProvider, makeHistogramProvider } from '@willsoto/nestjs-prometheus';

import { Stat } from './entity/stats.entity';
import { StatsController } from './stats.controller';
import { StatsRepository } from './stats.repository';
import { StatsService } from './stats.service';
import { CalculatedStatsModule } from '../calculatedStats/calculatedStats.module';
import { KeywordsModule } from '../keywords/keywords.module';
import { MetricHelp, MetricLabels, MetricNames } from '../metrics/metrics.constant';
import { UsersModule } from '../users/users.module';
import { UserSessionModule } from '../userSession/userSession.module';

@Module({
  imports: [TypeOrmModule.forFeature([Stat]), UserSessionModule, UsersModule, KeywordsModule, CalculatedStatsModule],
  providers: [
    StatsService,
    StatsRepository,
    makeCounterProvider({
      name: MetricNames.DB_REQUEST_STATS_TOTAL,
      help: MetricHelp.DB_REQUEST_STATS_TOTAL_HELP,
      labelNames: [MetricLabels.METHOD],
    }),
    makeHistogramProvider({
      name: MetricNames.DB_REQUEST_STATS_DURATION,
      help: MetricHelp.DURATION_DB_REQUEST_STATS_HELP,
      labelNames: [MetricLabels.METHOD, MetricLabels.STATUS],
      buckets: [0.1, 0.5, 1, 3, 5, 10],
    }),
  ],
  controllers: [StatsController],
  exports: [StatsService],
})
export class StatsModule {}
