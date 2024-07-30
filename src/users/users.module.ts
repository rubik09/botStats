import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';

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
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
