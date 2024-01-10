import {IsString, Length, IsPhoneNumber} from 'class-validator';

export class UpdateSessionDto {
    @IsString()
    readonly keywords: string;

    @IsString()
    readonly region: string;

    @IsString()
    @Length(5, 32)
    readonly username: string;
}
