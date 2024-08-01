import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { makeCounterProvider, makeHistogramProvider } from '@willsoto/nestjs-prometheus';

import { Keyword } from './entity/keywords.entity';
import { KeywordsController } from './keywords.controller';
import { KeywordsRepository } from './keywords.repository';
import { KeywordsService } from './keywords.service';
import { MetricHelp, MetricLabels, MetricNames } from '../metrics/metrics.constant';
import { UserSessionModule } from '../userSession/userSession.module';

@Module({
  imports: [TypeOrmModule.forFeature([Keyword]), UserSessionModule],
  providers: [
    KeywordsService,
    KeywordsRepository,
    makeCounterProvider({
      name: MetricNames.DB_REQUEST_KEYWORDS_TOTAL,
      help: MetricHelp.DB_REQUEST_KEYWORDS_TOTAL_HELP,
      labelNames: [MetricLabels.METHOD],
    }),
    makeHistogramProvider({
      name: MetricNames.DB_REQUEST_KEYWORDS_DURATION,
      help: MetricHelp.DURATION_DB_REQUEST_KEYWORDS_HELP,
      labelNames: [MetricLabels.METHOD, MetricLabels.STATUS],
      buckets: [0.1, 0.5, 1, 3, 5, 10],
    }),
  ],
  exports: [KeywordsService],
  controllers: [KeywordsController],
})
export class KeywordsModule {}
