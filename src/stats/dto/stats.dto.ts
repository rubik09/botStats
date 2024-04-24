import { IsInt, IsNumber, Length, Min } from 'class-validator';

import { UserSession } from '../../userSession/entity/userSession.entity';
import { Stat } from '../entity/stats.entity';

export class StatsDto {
  @IsInt()
  id: UserSession['id'];

  @IsInt()
  @Length(5, 11)
  apiIdClient: Stat['apiIdClient'];

  @IsNumber()
  @Min(0)
  incomingMessagesCount: Stat['incomingMessagesCount'];

  @IsNumber()
  @Min(0)
  outgoingMessagesCount: Stat['outgoingMessagesCount'];

  @IsNumber()
  @Min(0)
  usersCount: Stat['usersCount'];
}
