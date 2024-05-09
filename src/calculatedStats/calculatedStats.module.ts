import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CalculatedStatsController } from './calculatedStats.controller';
import { CalculatedStatsRepository } from './calculatedStats.repository';
import { CalculatedStatsService } from './calculatedStats.service';
import { CalculatedStat } from './entity/calculatedStats.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([CalculatedStat]), AuthModule],
  providers: [CalculatedStatsService, CalculatedStatsRepository],
  controllers: [CalculatedStatsController],
  exports: [CalculatedStatsService],
})
export class CalculatedStatsModule {}
