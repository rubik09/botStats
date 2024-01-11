import {IsInt, IsNumber, Length} from "class-validator";
import {Stats} from "../entity/stats";

export class CreateStatsDto {
    @IsNumber()
    readonly incoming_messages_count: Stats['incomingMessagesCount'];

    @IsInt()
    @Length(5, 11)
    readonly api_id_client: Stats['apiIdClient'];
}
