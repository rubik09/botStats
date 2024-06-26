import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional, IsString, Length, Max, Min } from 'class-validator';

import { TelegramConnectDto } from './telegramConnect.dto';
import { Keyword } from '../../keywords/entity/keywords.entity';
import { PersonalInfo } from '../../personalInfo/entity/personalInfo.entity';
import { setupSteps } from '../../utils/consts';

export class CreateTelegramConnectionDto extends PartialType(
  PickType(TelegramConnectDto, ['telegramId', 'apiId', 'apiHash']),
) {
  @IsNumber()
  @Min(1)
  @Max(3)
  setupStep: setupSteps;

  @IsOptional()
  @Length(5, 5)
  code?: string;

  @IsOptional()
  @IsString()
  @Length(8, 30)
  accountPassword?: string;

  @IsOptional()
  username?: PersonalInfo['username'];

  @IsOptional()
  phoneNumber?: PersonalInfo['phoneNumber'];

  @IsOptional()
  keyword?: Keyword['keyword'];

  @IsOptional()
  activity?: Keyword['activity'];
}
