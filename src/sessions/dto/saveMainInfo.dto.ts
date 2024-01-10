import {IsPhoneNumber, IsString, Length} from "class-validator";

export class SaveMainInfoDto {
    @IsPhoneNumber()
    readonly phone_number: string;

    @IsString()
    @Length(5, 1)
    readonly user_id: string;

    @IsString()
    @Length(5, 32)
    readonly username: string;

    @IsString()
    readonly region: string;
}
