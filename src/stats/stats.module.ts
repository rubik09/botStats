import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Stats} from "./entity/stats";
import {StatsRepository} from "./stats.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Stats])],
  controllers: [StatsController],
  providers: [StatsService, StatsRepository],
})
export class StatsModule {}
