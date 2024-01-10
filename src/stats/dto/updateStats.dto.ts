import {IsNumber} from "class-validator";
import { StatsEntity } from '../entity/stats.entity';

export class UpdateStatsDto {
    @IsNumber()
    readonly incoming_messages_count: StatsEntity['incomingMessagesCount'];

    @IsNumber()
    readonly users_count: StatsEntity['usersCount'];
}
