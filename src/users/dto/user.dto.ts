import { IsInt, Length } from 'class-validator';

import { UserSession } from '../../userSession/entity/userSession.entity';
import { User } from '../entity/users.entity';

export class UserDto {
  @IsInt()
  id: UserSession['id'];

  @IsInt()
  @Length(5, 11)
  telegramId: User['telegramId'];

  @IsInt()
  @Length(5, 11)
  apiIdClient: User['apiIdClient'];
}
