import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { makeCounterProvider, makeHistogramProvider } from '@willsoto/nestjs-prometheus';

import { AdminsController } from './admins.controller';
import { AdminsRepository } from './admins.repository';
import { AdminsService } from './admins.service';
import { Admin } from './entity/admins.entity';
import { CounterMetricsConfig, HistogramMetricsConfig } from '../metrics/metrics.constant';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  providers: [
    AdminsService,
    AdminsRepository,
    makeCounterProvider(CounterMetricsConfig.DB_REQUEST_ADMINS_TOTAL),
    makeHistogramProvider(HistogramMetricsConfig.DB_REQUEST_ADMINS_DURATION),
  ],
  controllers: [AdminsController],
  exports: [AdminsRepository, AdminsService],
})
export class AdminsModule {}
