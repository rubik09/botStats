import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Stats } from './entity/stats.entity';
import { StatsController } from './stats.controller';
import { StatsRepository } from './stats.repository';
import { StatsService } from './stats.service';
import { UsersModule } from '../users/users.module';
import { UserSessionModule } from '../userSession/userSession.module';

@Module({
  imports: [TypeOrmModule.forFeature([Stats]), UserSessionModule, UsersModule],
  providers: [StatsService, StatsRepository],
  controllers: [StatsController],
  exports: [StatsService],
})
export class StatsModule {}
