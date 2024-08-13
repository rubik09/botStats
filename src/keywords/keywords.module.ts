import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { makeCounterProvider, makeHistogramProvider } from '@willsoto/nestjs-prometheus';

import { Keyword } from './entity/keywords.entity';
import { KeywordsController } from './keywords.controller';
import { KeywordsRepository } from './keywords.repository';
import { KeywordsService } from './keywords.service';
import { CounterMetricsConfig, HistogramMetricsConfig } from '../metrics/metrics.constant';
import { UserSessionModule } from '../userSession/userSession.module';

@Module({
  imports: [TypeOrmModule.forFeature([Keyword]), UserSessionModule],
  providers: [
    KeywordsService,
    KeywordsRepository,
    makeCounterProvider(CounterMetricsConfig.DB_REQUEST_KEYWORDS_TOTAL),
    makeHistogramProvider(HistogramMetricsConfig.DB_REQUEST_KEYWORDS_DURATION),
  ],
  exports: [KeywordsService],
  controllers: [KeywordsController],
})
export class KeywordsModule {}
