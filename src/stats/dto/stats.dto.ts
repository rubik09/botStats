import { IsInt, IsNumber, Length, Min } from 'class-validator';

import { UserSession } from '../../userSession/entity/userSession.entity';
import { Stats } from '../entity/stats.entity';

export class StatsDto {
  @IsInt()
  id: UserSession['id'];

  @IsInt()
  @Length(5, 11)
  apiIdClient: Stats['apiIdClient'];

  @IsNumber()
  @Min(0)
  incomingMessagesCount: Stats['incomingMessagesCount'];

  @IsNumber()
  @Min(0)
  outgoingMessagesCount: Stats['outgoingMessagesCount'];

  @IsNumber()
  @Min(0)
  usersCount: Stats['usersCount'];
}
