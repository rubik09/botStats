import {IsInt, Length} from 'class-validator';
import {Users} from '../entity/users';
import {Sessions} from "../../sessions/entity/sessions";

export class UserDto {
    @IsInt()
    id: Sessions['id'];

    @IsInt()
    @Length(5, 11)
    userId: Users['userId'];

    @IsInt()
    @Length(5, 11)
    apiIdClient: Users['apiIdClient'];
}
