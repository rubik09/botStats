import {PickType} from '@nestjs/mapped-types';
import {StatsDto} from "./stats.dto";

export class UpdateStatsDto extends PickType(StatsDto, [
    'apiIdClient',
    'incomingMessagesCount',
    'usersCount',
]) {
}
