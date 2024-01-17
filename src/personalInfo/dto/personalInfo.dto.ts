import {IsInt, IsPhoneNumber, IsString, Length,} from "class-validator";
import {PersonalInfo} from "../entity/personalInfo";

export class PersonalInfoDto {
    @IsInt()
    id: PersonalInfo['id'];

    @IsString()
    region: PersonalInfo['region'];

    @IsString()
    @Length(5, 32)
    username: PersonalInfo['username'];

    @IsPhoneNumber()
    phoneNumber: PersonalInfo['phoneNumber'];
}
