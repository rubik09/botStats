import {IsInt, IsPhoneNumber, IsString, Length, IsBoolean} from "class-validator";
import {Sessions} from "../entity/sessions";

export class SessionDto {
    @IsInt()
    id: Sessions['id'];

    @IsString()
    logSession: Sessions['logSession'];

    @IsString()
    keywords: Sessions['keywords'];

    @IsString()
    region: Sessions['region'];

    @IsBoolean()
    status: Sessions['status'];

    @IsInt()
    @Length(5, 11)
    apiId: Sessions['apiId'];

    @IsString()
    apiHash: Sessions['apiHash'];

    @IsInt()
    @Length(5, 11)
    userId: Sessions['userId'];

    @IsString()
    @Length(5, 32)
    username: Sessions['username'];

    @IsPhoneNumber()
    phoneNumber: Sessions['phoneNumber'];
}
