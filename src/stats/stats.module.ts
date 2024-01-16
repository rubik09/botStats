import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Stats} from "./entity/stats";
import {StatsRepository} from "./stats.repository";
import {SessionsModule} from "../sessions/sessions.module";
import {UsersModule} from "../users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Stats]), SessionsModule, UsersModule],
  controllers: [StatsController],
  providers: [StatsService, StatsRepository],
})
export class StatsModule {}
