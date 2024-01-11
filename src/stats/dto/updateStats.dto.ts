import {IsNumber} from "class-validator";
import {Stats} from '../entity/stats';

export class UpdateStatsDto {
    @IsNumber()
    incomingMessagesCount: Stats['incomingMessagesCount'];

    @IsNumber()
    usersCount: Stats['usersCount'];
}
