import { PickType } from '@nestjs/mapped-types';

import { PersonalInfoDto } from './personalInfo.dto';

export class DeletePersonalInfoDto extends PickType(PersonalInfoDto, ['id']) {}
