import {IsInt, Length} from 'class-validator';
import {Users} from '../entity/users.entity';
import {UserSession} from "../../userSession/entity/userSession.entity";

export class UserDto {
    @IsInt()
    id: UserSession['id'];

    @IsInt()
    @Length(5, 11)
    telegramId: Users['telegramId'];

    @IsInt()
    @Length(5, 11)
    apiIdClient: Users['apiIdClient'];
}
