import { PickType } from '@nestjs/mapped-types';

import { UserSessionDto } from './userSession.dto';

export class DeleteUserSessionDto extends PickType(UserSessionDto, ['id']) {}
