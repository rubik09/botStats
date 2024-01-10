import {IsInt, IsString, Length} from "class-validator";

export class AddSessionInfoDto {
    @IsInt()
    @Length(5, 11)
    api_id: number;

    @IsString()
    readonly api_hash: string;
}
