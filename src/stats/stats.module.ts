import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import {StatsRepository} from "./stats.repository";

@Module({
  providers: [StatsService, StatsRepository],
  controllers: [StatsController]
})
export class StatsModule {}
