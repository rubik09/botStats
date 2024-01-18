import {IsInt, IsString, Length, IsBoolean} from "class-validator";
import {UserSessionEntity} from "../entity/userSession.entity";

export class UserSessionDto {
    @IsInt()
    id: UserSessionEntity['id'];

    @IsString()
    logSession: UserSessionEntity['logSession'];

    @IsString()
    keywords: UserSessionEntity['keywords'];

    @IsBoolean()
    status: UserSessionEntity['status'];

    @IsInt()
    @Length(5, 11)
    apiId: UserSessionEntity['apiId'];

    @IsString()
    apiHash: UserSessionEntity['apiHash'];

    @IsInt()
    @Length(5, 11)
    userId: UserSessionEntity['userId'];
}
