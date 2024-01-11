import {IsInt, IsNumber, Length} from "class-validator";
import {Stats} from "../entity/stats";
import {Sessions} from "../../sessions/entity/sessions";

export class StatDto {
    @IsInt()
    id: Sessions['id'];

    @IsInt()
    @Length(5, 11)
    apiIdClient: Stats['apiIdClient'];

    @IsNumber()
    incomingMessagesCount: Stats['incomingMessagesCount'];

    @IsNumber()
    usersCount: Stats['usersCount'];
}
