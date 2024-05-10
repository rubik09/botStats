import { IsEmail, IsInt, IsString, Length, IsOptional } from 'class-validator';

import { Admin } from '../entity/admins.entity';

export class AdminDto {
  @IsInt()
  id: Admin['id'];

  @IsEmail()
  email: Admin['email'];

  @IsString()
  @Length(8, 40)
  password: Admin['password'];

  @IsOptional()
  adminRoles?: Admin['adminRoles'];
}
