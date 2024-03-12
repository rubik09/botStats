import {IsInt, IsString, Min, MinLength} from 'class-validator';
import {Keywords} from "../entity/keywords.entity";

export class KeywordsDto {
  @IsInt()
  id: Keywords['id'];

  @IsString()
  @MinLength(2)
  activity: Keywords['activity'];

  @IsString()
  @MinLength(1)
  keyword: Keywords['keyword'];

  @IsInt()
  @Min(0)
  count: Keywords['count'];

  userSession: Keywords['userSession'];
}
