import {IsInt, IsString, Length} from "class-validator";
import {SessionsEntity} from "../entity/sessions.entity";

export class AddSessionInfoDto {
    @IsInt()
    @Length(5, 11)
    api_id: SessionsEntity['apiId'];

    @IsString()
    readonly api_hash: SessionsEntity['apiHash'];
}
