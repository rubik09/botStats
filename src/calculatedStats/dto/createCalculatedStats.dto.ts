import { PickType } from '@nestjs/mapped-types';

import { CalculatedStatDto } from './calculatedStat.dto';

export class CreateCalculatedStatsDto extends PickType(CalculatedStatDto, [
  'username',
  'incomingMessagesCount',
  'usersCount',
  'averageMessagesCount',
  'keywords',
  'createdAt',
  'time',
]) {}
