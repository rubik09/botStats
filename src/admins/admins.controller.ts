import { Body, Controller, Post } from '@nestjs/common';

import {AdminsService} from "./admins.service";
import {AdminLoginDto} from "./dto/adminLogin.dto";
import {TToken} from "../utils/types";
import {CreateAdminDto} from "./dto/createAdmin.dto";

@Controller('admins')
export class AdminsController {
  constructor(
      private adminsService: AdminsService
  ) {}

  @Post('/login')
  async login(@Body() adminLoginDto: AdminLoginDto): Promise<TToken> {
    const token = await this.adminsService.login(adminLoginDto);
    return { token };
  }

  @Post('/register')
  async register(@Body() createAdminDto: CreateAdminDto): Promise<TToken> {
    const token = await this.adminsService.register(createAdminDto);
    return { token };
  }
}
