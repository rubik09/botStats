import { PickType } from '@nestjs/mapped-types';
import { IsNumber, Min } from 'class-validator';
import { CalculatedStatDto } from './calculatedStat.dto';

export class GetStatsByUsernameDto extends PickType(CalculatedStatDto, [
  'username',
]) {
  @IsNumber()
  @Min(1)
  page: number;

  @IsNumber()
  @Min(1)
  limit: number;
}
