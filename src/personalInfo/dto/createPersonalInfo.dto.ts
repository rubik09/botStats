import {PickType} from '@nestjs/mapped-types';
import {PersonalInfoDto} from "./personalInfo.dto";

export class CreatePersonalInfoDto extends PickType(PersonalInfoDto, [
    'region',
    'username',
    'phoneNumber'
]) {
}
