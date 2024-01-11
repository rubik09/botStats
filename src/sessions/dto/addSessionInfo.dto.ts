import {IsInt, IsString, Length} from "class-validator";
import {Sessions} from "../entity/sessions";

export class AddSessionInfoDto {
    @IsInt()
    @Length(5, 11)
    apiId: Sessions['apiId'];

    @IsString()
    apiHash: Sessions['apiHash'];
}
