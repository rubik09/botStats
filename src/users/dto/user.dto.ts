import {IsInt, Length} from 'class-validator';
import {Users} from '../entity/users';
import {UserSession} from "../../userSession/entity/userSession";

export class UserDto {
    @IsInt()
    id: UserSession['id'];

    @IsInt()
    @Length(5, 11)
    userId: Users['userId'];

    @IsInt()
    @Length(5, 11)
    apiIdClient: Users['apiIdClient'];
}
