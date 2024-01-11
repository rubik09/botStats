import {IsInt, IsPhoneNumber, IsString, Length} from "class-validator";
import {Sessions} from "../entity/sessions";

export class SaveMainInfoDto {
    @IsPhoneNumber()
    phoneNumber: Sessions['phoneNumber'];

    @IsInt()
    @Length(5, 11)
    userId: Sessions['userId'];

    @IsString()
    @Length(5, 32)
    username: Sessions['username'];

    @IsString()
    region: Sessions['region'];
}
