import {PickType} from '@nestjs/mapped-types';
import {SessionDto} from "./session.dto";

export class DeleteSessionDto extends PickType(SessionDto, [
    'id',
]) {
}
