import {IsInt, IsPhoneNumber, IsString, Length, IsBoolean} from "class-validator";
import {UserSession} from "../entity/userSession";

export class UserSessionDto {
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
    userId: UserSession['userId'];
}
