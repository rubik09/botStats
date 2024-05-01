import { PickType } from '@nestjs/mapped-types';
import { IsNumber, Min } from 'class-validator';

import { CalculatedStatDto } from './calculatedStat.dto';

export class GetStatsDto extends PickType(CalculatedStatDto, ['username']) {
  @IsNumber()
  @Min(0)
  offset: number;

  @IsNumber()
  @Min(1)
  limit: number;
}
