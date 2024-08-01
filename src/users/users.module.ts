import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { makeCounterProvider, makeHistogramProvider } from '@willsoto/nestjs-prometheus';

import { User } from './entity/users.entity';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { MetricHelp, MetricLabels, MetricNames } from '../metrics/metrics.constant';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UsersService,
    UsersRepository,
    makeCounterProvider({
      name: MetricNames.DB_REQUEST_USERS_TOTAL,
      help: MetricHelp.DB_REQUEST_USERS_TOTAL_HELP,
      labelNames: [MetricLabels.METHOD],
    }),
    makeHistogramProvider({
      name: MetricNames.DB_REQUEST_USERS_DURATION,
      help: MetricHelp.DURATION_DB_REQUEST_USERS_HELP,
      labelNames: [MetricLabels.METHOD, MetricLabels.STATUS],
      buckets: [0.1, 0.5, 1, 3, 5, 10],
    }),
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
