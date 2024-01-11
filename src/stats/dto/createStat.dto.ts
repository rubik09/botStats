import {PickType} from '@nestjs/mapped-types';
import {StatDto} from "./stat.dto";

export class CreateStatDto extends PickType(StatDto, [
    'incomingMessagesCount',
    'apiIdClient',
]) {
}
