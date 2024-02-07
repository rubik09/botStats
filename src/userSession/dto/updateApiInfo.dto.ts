import {PickType} from '@nestjs/mapped-types';
import {UserSessionDto} from "./userSession.dto";

export class UpdateApiInfoDto extends (PickType(UserSessionDto, ['apiId', 'apiHash',])) {
}

