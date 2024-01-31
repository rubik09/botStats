import {PickType} from '@nestjs/mapped-types';
import {UserSessionDto} from "./userSession.dto";

export class UpdateUserSessionInfoDto extends (PickType(UserSessionDto, ['apiId', 'apiHash',])) {
}

