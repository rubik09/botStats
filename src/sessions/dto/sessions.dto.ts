import {IsString} from 'class-validator';

export class SaveMainInfoDto {
    @IsString()
    readonly phone_number: string;

    @IsString()
    readonly user_id: string;

    @IsString()
    readonly username: string;

    @IsString()
    readonly region: string;
}

export class UpdateSessionInfoDto {
    @IsString()
    readonly api_id: string;

    @IsString()
    readonly api_hash: string;
}

export class UpdateClientDto {
    @IsString()
    readonly keywords: string;

    @IsString()
    readonly region: string;

    @IsString()
    readonly username: string;
}
