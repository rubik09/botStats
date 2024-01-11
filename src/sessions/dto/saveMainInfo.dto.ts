import {PickType} from '@nestjs/mapped-types';
import {SessionDto} from "./session.dto";

export class SaveMainInfoDto extends PickType(SessionDto, [
    'phoneNumber',
    'userId',
    'username',
    'region',
]) {
}
