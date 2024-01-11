import {PickType} from '@nestjs/mapped-types';
import {SessionDto} from "./session.dto";

export class SaveSessionInfoDto extends PickType(SessionDto, [
    'apiId',
    'apiHash',
]) {
}

