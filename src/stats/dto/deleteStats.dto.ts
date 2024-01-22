import {PickType} from '@nestjs/mapped-types';
import {StatsDto} from "./stats.dto";

export class DeleteStatsDto extends PickType(StatsDto, [
    'apiIdClient',
]) {
}
