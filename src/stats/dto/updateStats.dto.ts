import { PartialType, PickType } from '@nestjs/mapped-types';

import { StatsDto } from './stats.dto';

export class UpdateStatsDto extends PartialType(
  PickType(StatsDto, ['incomingMessagesCount', 'usersCount', 'outgoingMessagesCount']),
) {}
