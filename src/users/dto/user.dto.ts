import {IsInt, Length} from 'class-validator';
import {UsersEntity} from '../entity/users.entity';
import {UserSessionEntity} from "../../userSession/entity/userSession.entity";

export class UserDto {
    @IsInt()
    id: UserSessionEntity['id'];

    @IsInt()
    @Length(5, 11)
    userId: UsersEntity['userId'];

    @IsInt()
    @Length(5, 11)
    apiIdClient: UsersEntity['apiIdClient'];
}
