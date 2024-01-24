import {Module} from '@nestjs/common';
import {StatsService} from './stats.service';
import {StatsController} from './stats.controller';
import {StatsRepository} from "./stats.repository";
import {UsersModule} from "../users/users.module";
import {Stats} from "./entity/stats.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserSessionModule} from "../userSession/userSession.module";


@Module({
    imports: [TypeOrmModule.forFeature([Stats]), UserSessionModule, UsersModule],
    providers: [StatsService, StatsRepository],
    controllers: [StatsController]
})
export class StatsModule {
}
