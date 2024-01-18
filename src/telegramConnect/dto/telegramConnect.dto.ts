import {IsInt, IsString, Length, IsBoolean} from "class-validator";
import {UserSession} from "../../userSession/entity/userSession.entity";

export class TelegramConnectDto {
    @IsInt()
    id: UserSession['id'];

    @IsString()
    logSession: UserSession['logSession'];

    @IsString()
    keywords: UserSession['keywords'];

    @IsBoolean()
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
