import {PickType} from '@nestjs/mapped-types';
import {StatDto} from "./stat.dto";
import {Sessions} from "../../sessions/entity/sessions";

export class StatsSendingDto extends PickType(StatDto, [
    'incomingMessagesCount',
    'usersCount',
]) {
    username: Sessions['username'];
    averageMessagesCount: number;
    keywords: Sessions['keywords'][];
}
