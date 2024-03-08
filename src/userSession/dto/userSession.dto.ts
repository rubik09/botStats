import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsString, Max, Min } from 'class-validator';

import { UserSession, userSessionStatus } from '../entity/userSession.entity';

export class UserSessionDto {
  @IsInt()
  id: UserSession['id'];

  @IsString()
  logSession: UserSession['logSession'];

  @IsEnum(userSessionStatus)
  status: UserSession['status'];

  @IsInt()
  @Min(10000)
  @Max(99999999999)
  apiId: UserSession['apiId'];

  @IsString()
  apiHash: UserSession['apiHash'];

  @IsInt()
  @Transform(({ value }) => {
    return Number(value);
  })
  @Min(10000)
  @Max(99999999999)
  telegramId: UserSession['telegramId'];

  personalInfo: UserSession['personalInfo'];
}
