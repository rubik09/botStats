import { IsEmail, IsInt, IsString, Length } from 'class-validator';

import { Admins } from '../entity/admins.entity';

export class AdminDto {
  @IsInt()
  id: Admins['id'];

  @IsEmail()
  email: Admins['email'];

  @IsString()
  @Length(8, 40)
  password: Admins['password'];
}
