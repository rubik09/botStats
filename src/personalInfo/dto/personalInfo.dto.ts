import {IsInt, IsPhoneNumber, IsString, Length,} from "class-validator";
import {PersonalInfoEntity} from "../entity/personalInfo.entity";

export class PersonalInfoDto {
    @IsInt()
    id: PersonalInfoEntity['id'];

    @IsString()
    region: PersonalInfoEntity['region'];

    @IsString()
    @Length(5, 32)
    username: PersonalInfoEntity['username'];

    @IsPhoneNumber()
    phoneNumber: PersonalInfoEntity['phoneNumber'];
}
