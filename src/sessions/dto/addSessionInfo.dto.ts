import {IsInt, IsString, Length} from "class-validator";
import {Sessions} from "../entity/sessions";

export class AddSessionInfoDto {
    @IsInt()
    @Length(5, 11)
    api_id: Sessions['apiId'];

    @IsString()
    readonly api_hash: Sessions['apiHash'];
}
