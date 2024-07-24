import { PickType } from '@nestjs/mapped-types';
import { IsISO8601, IsNumber, Min } from 'class-validator';

import { CalculatedStatDto } from './calculatedStat.dto';

export class GetStatsDto extends PickType(CalculatedStatDto, ['username']) {
  @IsNumber()
  @Min(0)
  offset: number;

  @IsNumber()
  @Min(1)
  limit: number;

  @IsISO8601()
  from?: CalculatedStatDto['createdAt'];

  @IsISO8601()
  to?: CalculatedStatDto['createdAt'];
}
