import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';

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
  ],
  controllers: [AdminsController],
  exports: [AdminsRepository, AdminsService],
})
export class AdminsModule {}
