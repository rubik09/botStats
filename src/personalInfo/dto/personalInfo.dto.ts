import { IsInt, IsPhoneNumber, IsString, Length } from 'class-validator';

import { PersonalInfo } from '../entity/personalInfo.entity';

export class PersonalInfoDto {
  @IsInt()
  id: PersonalInfo['id'];

  @IsString()
  @Length(2, 25)
  region: PersonalInfo['region'];

  @IsString()
  @Length(5, 32)
  username: PersonalInfo['username'];

  @IsPhoneNumber()
  phoneNumber: PersonalInfo['phoneNumber'];
}
