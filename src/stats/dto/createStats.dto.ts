import {IsInt, IsNumber, Length} from "class-validator";
import {StatsEntity} from "../entity/stats.entity";

export class CreateStatsDto {
    @IsNumber()
    readonly incoming_messages_count: StatsEntity['incomingMessagesCount'];

    @IsInt()
    @Length(5, 11)
    readonly api_id_client: StatsEntity['apiIdClient'];
}
