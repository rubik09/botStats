import {IsInt, IsNumber, Length} from "class-validator";
import {StatsEntity} from "../entity/stats.entity";
import {UserSessionEntity} from "../../userSession/entity/userSession.entity";

export class StatDto {
    @IsInt()
    id: UserSessionEntity['id'];

    @IsInt()
    @Length(5, 11)
    apiIdClient: StatsEntity['apiIdClient'];

    @IsNumber()
    incomingMessagesCount: StatsEntity['incomingMessagesCount'];

    @IsNumber()
    usersCount: StatsEntity['usersCount'];
}
