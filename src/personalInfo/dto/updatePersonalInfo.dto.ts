import {PartialType, PickType} from '@nestjs/mapped-types';
import {PersonalInfoDto} from "./personalInfo.dto";

export class UpdatePersonalInfoDto extends PartialType(PickType(PersonalInfoDto, ['region', 'username', 'phoneNumber']),
) {
}
