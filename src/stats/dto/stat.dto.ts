import {IsInt, IsNumber, Length} from "class-validator";
import {Stats} from "../entity/stats";
import {UserSession} from "../../userSession/entity/userSession";

export class StatDto {
    @IsInt()
    id: UserSession['id'];

    @IsInt()
    @Length(5, 11)
    apiIdClient: Stats['apiIdClient'];

    @IsNumber()
    incomingMessagesCount: Stats['incomingMessagesCount'];

    @IsNumber()
    usersCount: Stats['usersCount'];
}
