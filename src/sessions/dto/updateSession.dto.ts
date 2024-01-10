import {IsString, Length} from 'class-validator';
import {SessionsEntity} from "../entity/sessions.entity";

export class UpdateSessionDto {
    @IsString()
    readonly keywords: SessionsEntity['keywords'];

    @IsString()
    readonly region: SessionsEntity['region'];

    @IsString()
    @Length(5, 32)
    readonly username: SessionsEntity['username'];
}
