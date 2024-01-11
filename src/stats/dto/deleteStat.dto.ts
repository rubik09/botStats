import {PickType} from '@nestjs/mapped-types';
import {StatDto} from "./stat.dto";

export class DeleteStatDto extends PickType(StatDto, [
    'apiIdClient',
]) {
}
