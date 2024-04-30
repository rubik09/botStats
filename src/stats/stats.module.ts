import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Stat } from './entity/stats.entity';
import { StatsController } from './stats.controller';
import { StatsRepository } from './stats.repository';
import { StatsService } from './stats.service';
import { CalculatedStatsModule } from '../calculatedStats/calculatedStats.module';
import { KeywordsModule } from '../keywords/keywords.module';
import { UsersModule } from '../users/users.module';
import { UserSessionModule } from '../userSession/userSession.module';

@Module({
  imports: [TypeOrmModule.forFeature([Stat]), UserSessionModule, UsersModule, KeywordsModule, CalculatedStatsModule],
  providers: [StatsService, StatsRepository],
  controllers: [StatsController],
  exports: [StatsService],
})
export class StatsModule {}
