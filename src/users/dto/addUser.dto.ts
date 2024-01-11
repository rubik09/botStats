import {IsInt, Length} from 'class-validator';
import {Users} from '../entity/users';

export class AddUserDTO {
    @IsInt()
    @Length(5, 11)
    userId: Users['userId'];

    @IsInt()
    @Length(5, 11)
    apiIdClient: Users['apiIdClient'];
}
