import {IsInt, IsPhoneNumber, IsString, Length} from "class-validator";
import {SessionsEntity} from "../entity/sessions.entity";

export class SaveMainInfoDto {
    @IsPhoneNumber()
    readonly phone_number: SessionsEntity['phoneNumber'];

    @IsInt()
    @Length(5, 11)
    readonly user_id: SessionsEntity['userId'];

    @IsString()
    @Length(5, 32)
    readonly username: SessionsEntity['username'];

    @IsString()
    readonly region: SessionsEntity['region'];
}
