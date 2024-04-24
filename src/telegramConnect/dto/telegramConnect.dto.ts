import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsString, Max, Min } from 'class-validator';

import { Keyword } from '../../keywords/entity/keywords.entity';
import { UserSession, userSessionStatus } from '../../userSession/entity/userSession.entity';

export class TelegramConnectDto {
  @IsInt()
  id: UserSession['id'];

  @IsString()
  logSession: UserSession['logSession'];

  @IsString()
  keywords: Keyword;

  @IsEnum(userSessionStatus)
  status: UserSession['status'];

  @Transform(({ value }) => {
    return Number(value);
  })
  @IsInt()
  @Min(10000)
  @Max(99999999999)
  apiId: UserSession['apiId'];

  @IsString()
  apiHash: UserSession['apiHash'];

  @Transform(({ value }) => {
    return Number(value);
  })
  @IsInt()
  @Min(10000)
  @Max(99999999999)
  telegramId: UserSession['telegramId'];
}
