import {IsEmail, IsInt, IsString, Length} from "class-validator";
import {AdminsEntity} from "../entity/admins.entity";

export class AdminDto {
    @IsInt()
    id: AdminsEntity['id'];

    @IsEmail()
    email: AdminsEntity['email'];

    @IsString()
    @Length(8, 40)
    password: AdminsEntity['password'];
}
