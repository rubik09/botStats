import {PickType} from '@nestjs/mapped-types';
import {UserSessionDto} from "./userSession.dto";

export class UpdateUserSessionDto extends PickType(UserSessionDto, [
    'keywords',
    'region',
    'username',
]) {
}
