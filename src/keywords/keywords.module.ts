import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrometheusModule, makeHistogramProvider } from '@willsoto/nestjs-prometheus';

import { Keyword } from './entity/keywords.entity';
import { KeywordsController } from './keywords.controller';
import { KeywordsRepository } from './keywords.repository';
import { KeywordsService } from './keywords.service';
import { UserSessionModule } from '../userSession/userSession.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Keyword]),
    UserSessionModule,
    PrometheusModule.register({
      defaultMetrics: {
        enabled: false,
      },
    }),
  ],
  providers: [
    KeywordsService,
    KeywordsRepository,
    makeHistogramProvider({
      name: 'db_request_duration_seconds',
      help: 'Duration of database requests in seconds',
      labelNames: ['method'],
    }),
  ],
  exports: [KeywordsService],
  controllers: [KeywordsController],
})
export class KeywordsModule {}
