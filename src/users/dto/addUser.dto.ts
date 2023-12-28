import {IsString} from 'class-validator';

export class AddUserDto {
    @IsString()
    readonly user_id: string;

    @IsString()
    readonly api_id_client: string;
}
