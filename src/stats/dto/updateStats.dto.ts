import {IsNumber} from "class-validator";
import {Stats} from '../entity/stats';

export class UpdateStatsDto {
    @IsNumber()
    readonly incoming_messages_count: Stats['incomingMessagesCount'];

    @IsNumber()
    readonly users_count: Stats['usersCount'];
}
