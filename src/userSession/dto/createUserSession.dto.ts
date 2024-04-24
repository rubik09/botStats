import { PartialType, PickType } from '@nestjs/mapped-types';

import { UserSessionDto } from './userSession.dto';

export class CreateUserSessionDto extends PartialType(PickType(UserSessionDto, ['telegramId', 'personalInfo'])) {}
