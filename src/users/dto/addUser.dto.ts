import {IsInt, Length} from 'class-validator';
import {Users} from '../entity/users';

export class AddUserDTO {
    @IsInt()
    @Length(5, 11)
    user_id: Users['userId'];

    @IsInt()
    @Length(5, 11)
    api_id_client: Users['apiIdClient'];
}
