import { IsInt, IsString, MaxLength, Min, MinLength } from 'class-validator';

import { Keyword } from '../entity/keywords.entity';

export class KeywordsDto {
  @IsInt()
  id: Keyword['id'];

  @IsString()
  @MinLength(2)
  @MaxLength(20)
  activity: Keyword['activity'];

  @IsString()
  @MinLength(1)
  @MaxLength(20)
  keyword: Keyword['keyword'];

  @IsInt()
  @Min(0)
  count: Keyword['count'];

  userSession: Keyword['userSession'];
}
