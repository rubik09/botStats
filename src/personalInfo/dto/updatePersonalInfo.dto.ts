import {PickType} from '@nestjs/mapped-types';
import {PersonalInfoDto} from "./personalInfo.dto";

export class UpdatePersonalInfoDto extends PickType(PersonalInfoDto, [
    'id',
    'region',
    'username',
    'phoneNumber'
]) {
}
