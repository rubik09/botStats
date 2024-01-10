import {IsString, Length} from "class-validator";

export class AddSessionInfoDto {
    @IsString()
    @Length(5, 11)
    readonly api_id: string;

    @IsString()
    readonly api_hash: string;
}
