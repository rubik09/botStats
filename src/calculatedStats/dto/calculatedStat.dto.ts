import { IsDateString, IsInt, IsNumber, IsString, Length, Min } from 'class-validator';

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

  @IsNumber()
  @Min(0)
  averageMessagesCount: CalculatedStat['averageMessagesCount'];

  @IsString()
  keywords: CalculatedStat['keywords'];

  @IsDateString()
  createdAt: CalculatedStat['createdAt'];

  @IsString()
  time: CalculatedStat['time'];
}
