import {IsInt, IsString, Length, IsEnum} from "class-validator";
import {UserSession, userSessionStatus} from "../entity/userSession.entity";

export class UserSessionDto {
    @IsInt()
    id: UserSession['id'];

    @IsString()
    logSession: UserSession['logSession'];

    @IsString()
    keywords: UserSession['keywords'];

    @IsEnum(userSessionStatus)
    status: UserSession['status'];

    @IsInt()
    @Length(5, 11)
    apiId: UserSession['apiId'];

    @IsString()
    apiHash: UserSession['apiHash'];

    @IsInt()
    @Length(5, 11)
    telegramId: UserSession['telegramId'];
}