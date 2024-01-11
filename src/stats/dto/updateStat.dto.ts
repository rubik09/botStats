import {PickType} from '@nestjs/mapped-types';
import {StatDto} from "./stat.dto";

export class UpdateStatDto extends PickType(StatDto, [
    'apiIdClient',
    'incomingMessagesCount',
    'usersCount',
]) {
}
