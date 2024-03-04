import { IsInt, IsString, IsEnum, Min, Max } from "class-validator";
import { UserSession, userSessionStatus } from "../entity/userSession.entity";
import { Transform } from "class-transformer";

export class UserSessionDto {
  @IsInt()
  id: UserSession["id"];

  @IsString()
  logSession: UserSession["logSession"];

  @IsString()
  keywords: UserSession["keywords"];

  @IsEnum(userSessionStatus)
  status: UserSession["status"];

  @IsInt()
  @Min(10000)
  @Max(99999999999)
  apiId: UserSession["apiId"];

  @IsString()
  apiHash: UserSession["apiHash"];

  @IsInt()
  @Transform(({ value }) => {
    return Number(value);
  })
  @Min(10000)
  @Max(99999999999)
  telegramId: UserSession["telegramId"];

  personalInfo: UserSession["personalInfo"];
}
