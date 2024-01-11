import {IsInt, IsNumber, Length} from "class-validator";
import {Stats} from "../entity/stats";

export class CreateStatsDto {
    @IsNumber()
    incomingMessagesCount: Stats['incomingMessagesCount'];

    @IsInt()
    @Length(5, 11)
    apiIdClient: Stats['apiIdClient'];
}
