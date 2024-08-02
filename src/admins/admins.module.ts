import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { makeCounterProvider, makeHistogramProvider } from '@willsoto/nestjs-prometheus';

import { AdminsController } from './admins.controller';
import { AdminsRepository } from './admins.repository';
import { AdminsService } from './admins.service';
import { Admin } from './entity/admins.entity';
import { MetricHelp, MetricLabels, MetricNames } from '../metrics/metrics.constant';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  providers: [
    AdminsService,
    AdminsRepository,
    makeCounterProvider({
      name: MetricNames.DB_REQUEST_ADMINS_TOTAL,
      help: MetricHelp.DB_REQUEST_ADMINS_TOTAL_HELP,
      labelNames: [MetricLabels.METHOD],
    }),
    makeHistogramProvider({
      name: MetricNames.DB_REQUEST_ADMINS_DURATION,
      help: MetricHelp.DURATION_DB_REQUEST_ADMINS_HELP,
      labelNames: [MetricLabels.METHOD, MetricLabels.STATUS],
      buckets: [0.1, 0.5, 1, 3, 5, 10],
    }),
  ],
  controllers: [AdminsController],
  exports: [AdminsRepository, AdminsService],
})
export class AdminsModule {}
