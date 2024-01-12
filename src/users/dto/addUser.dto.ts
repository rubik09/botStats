import {PickType} from '@nestjs/mapped-types';
import {UserDto} from "./user.dto";

export class AddUserDto extends PickType(UserDto, [
    'userId',
    'apiIdClient',
]) {
}
