import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CalculatedStatsController } from './calculatedStats.controller';
import { CalculatedStatsRepository } from './calculatedStats.repository';
import { CalculatedStatsService } from './calculatedStats.service';
import { CalculatedStat } from './entity/calculatedStats.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CalculatedStat])],
  providers: [CalculatedStatsService, CalculatedStatsRepository],
  controllers: [CalculatedStatsController],
})
export class CalculatedStatsModule {}
