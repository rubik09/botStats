import { Body, Controller, Post } from '@nestjs/common';

import {AdminsService} from "./admins.service";
import {AdminLoginDto} from "./dto/adminLogin.dto";
import {TToken} from "../utils/types";
import {AuthService} from "../auth/auth.service";
import {AdminValidateDto} from "./dto/adminValidate.dto";
import {RegisterAdminDto} from "./dto/registerAdmin.dto";

@Controller('admins')
export class AdminsController {
  constructor(
      private adminsService: AdminsService,
      private authService: AuthService

  ) {}

  @Post('/login')
  async login(@Body() {email, password}: AdminLoginDto): Promise<TToken> {
    const payload = {email};
    const adminValidateDto: AdminValidateDto = {
      email,
      password
    };

    await this.adminsService.validateAdmin(adminValidateDto);
    const token =  await this.authService.signKey(payload);
    return { token };
  }

  @Post('/register')
  async register(@Body() registerAdminDto: RegisterAdminDto): Promise<TToken> {
    const token = await this.adminsService.register(registerAdminDto);
    return { token };
  }
}
