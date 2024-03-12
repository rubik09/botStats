import { PartialType, PickType } from '@nestjs/mapped-types';

import { UserSessionDto } from './userSession.dto';

export class UpdateUserSessionInfoDto extends PartialType(
  PickType(UserSessionDto, ['logSession', 'status', 'telegramId']),
) {}
