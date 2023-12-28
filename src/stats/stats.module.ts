import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {StatsEntity} from "./entity/stats.entity";
import {StatsController} from "./stats.controller";
import {StatsService} from "./stats.service";
import {StatsProvider} from "./stats.provider";

@Module({
    imports: [TypeOrmModule.forFeature([StatsEntity])],
    controllers: [StatsController],
    providers: [StatsService, StatsProvider],
})
export class StatsModule {}
