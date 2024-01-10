import {IsInt, Length} from 'class-validator';
import {UsersEntity} from '../entity/users.entity';

export class AddUserDTO {
    @IsInt()
    @Length(5, 11)
    user_id: UsersEntity['userId'];

    @IsInt()
    @Length(5, 11)
    api_id_client: UsersEntity['apiIdClient'];
}
