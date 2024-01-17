import {IsInt, IsPhoneNumber, IsString, Length, IsBoolean} from "class-validator";
import {UserSession} from "../entity/userSession";

export class UserSessionDto {
    @IsInt()
    id: UserSession['id'];

    @IsString()
    logSession: UserSession['logSession'];

    @IsString()
    keywords: UserSession['keywords'];

    @IsString()
    region: UserSession['region'];

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

    @IsString()
    @Length(5, 32)
    username: UserSession['username'];

    @IsPhoneNumber()
    phoneNumber: UserSession['phoneNumber'];
}
