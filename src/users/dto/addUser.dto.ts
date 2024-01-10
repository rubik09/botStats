import { IsInt, IsString, Length } from 'class-validator';

export class AddUserDTO {

    @IsString()
    @Length(5, 11)
    user_id: string;

    @IsString()
    @Length(5, 255)
    api_id_client: string;

}
