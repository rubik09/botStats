import { IsInt, Length } from 'class-validator';

import { UserSession } from '../../userSession/entity/userSession.entity';
import { Users } from '../entity/users.entity';

export class UserDto {
  @IsInt()
  id: UserSession['id'];

  @IsInt()
  @Length(5, 11)
  telegramId: Users['telegramId'];

  @IsInt()
  @Length(5, 11)
  apiIdClient: Users['apiIdClient'];
}
