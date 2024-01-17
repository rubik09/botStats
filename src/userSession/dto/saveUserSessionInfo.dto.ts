import {PickType} from '@nestjs/mapped-types';
import {UserSessionDto} from "./userSession.dto";

export class SaveUserSessionInfoDto extends PickType(UserSessionDto, [
    'apiId',
    'apiHash',
]) {
}

