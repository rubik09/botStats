import { Body, Controller, Post } from '@nestjs/common';

import {AdminsService} from "./admins.service";
import {AdminLoginDto} from "./dto/adminLogin.dto";
import {AdminRegisterDto} from "./dto/adminRegister.dto";

@Controller('admins')
export class AdminsController {
  constructor(
      private adminsService: AdminsService
  ) {}

  @Post('/login')
  async login(@Body() adminLoginDto: AdminLoginDto): Promise<{ token: { access_token: string } }> {
    const token = await this.adminsService.login(adminLoginDto);
    return { token };
  }

  @Post('/register')
  async register(@Body() adminRegisterDto: AdminRegisterDto): Promise<{ token: { access_token: string } }> {
    const token = await this.adminsService.register(adminRegisterDto);
    return { token };
  }
}
