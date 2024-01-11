import {PickType} from '@nestjs/mapped-types';
import {UserDto} from "./user.dto";

export class AddUserDTO extends PickType(UserDto, [
    'userId',
    'apiIdClient',
]) {
}
