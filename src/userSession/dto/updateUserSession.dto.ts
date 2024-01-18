import {PickType} from '@nestjs/mapped-types';
import {UserSessionDto} from "./userSession.dto";

export class CreateUserSessionInfoDto extends PickType(UserSessionDto, [
    'id',
    'keywords',
    'status',
]) {
}

