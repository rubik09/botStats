import {PartialType, PickType} from '@nestjs/mapped-types';
import {UserSessionDto} from "./userSession.dto";

export class CreateUserSessionInfoDto extends PartialType(PickType(UserSessionDto, ['keywords', 'status',]),
) {
}

