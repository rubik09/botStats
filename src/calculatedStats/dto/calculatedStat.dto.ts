import { IsInt, IsISO8601, IsNumber, IsString, Length, Min } from 'class-validator';

import { CalculatedStat } from '../entity/calculatedStats.entity';

export class CalculatedStatDto {
  @IsInt()
  id: CalculatedStat['id'];

  @IsString()
  @Length(5, 32)
  username: CalculatedStat['username'];

  @IsNumber()
  @Min(0)
  incomingMessagesCount: CalculatedStat['incomingMessagesCount'];

  @IsNumber()
  @Min(0)
  usersCount: CalculatedStat['usersCount'];

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  averageMessagesCount: CalculatedStat['averageMessagesCount'];

  @IsString()
  calculatedKeywords: CalculatedStat['calculatedKeywords'];

  @IsString()
  time: CalculatedStat['time'];

  @IsISO8601()
  createdAt: CalculatedStat['createdAt'];
}
