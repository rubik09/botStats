import {IsInt, IsPhoneNumber, IsString, Length} from "class-validator";
import {Sessions} from "../entity/sessions";

export class SaveMainInfoDto {
    @IsPhoneNumber()
    readonly phone_number: Sessions['phoneNumber'];

    @IsInt()
    @Length(5, 11)
    readonly user_id: Sessions['userId'];

    @IsString()
    @Length(5, 32)
    readonly username: Sessions['username'];

    @IsString()
    readonly region: Sessions['region'];
}
