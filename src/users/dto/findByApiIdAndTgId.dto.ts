import { PickType } from '@nestjs/mapped-types';

import { UserDto } from './user.dto';

export class FindByApiIdAndTgIdDto extends PickType(UserDto, ['telegramId', 'apiIdClient']) {}
