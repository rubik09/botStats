import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { makeCounterProvider, makeHistogramProvider } from '@willsoto/nestjs-prometheus';

import { User } from './entity/users.entity';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { CounterMetricsConfig, HistogramMetricsConfig } from '../metrics/metrics.constant';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UsersService,
    UsersRepository,
    makeCounterProvider(CounterMetricsConfig.DB_REQUEST_USERS_TOTAL),
    makeHistogramProvider(HistogramMetricsConfig.DB_REQUEST_USERS_DURATION),
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
