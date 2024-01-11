import {IsString, Length} from 'class-validator';
import {Sessions} from "../entity/sessions";

export class UpdateSessionDto {
    @IsString()
    keywords: Sessions['keywords'];

    @IsString()
    readonly region: Sessions['region'];

    @IsString()
    @Length(5, 32)
    readonly username: Sessions['username'];
}
