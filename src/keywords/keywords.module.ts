import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { makeCounterProvider, makeGaugeProvider } from '@willsoto/nestjs-prometheus';

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
      help: MetricHelp.DB_REQUEST_KEYWORDS_TOTAL,
      labelNames: [MetricLabels.METHOD],
    }),
  ],
  exports: [KeywordsService],
  controllers: [KeywordsController],
})
export class KeywordsModule {}
