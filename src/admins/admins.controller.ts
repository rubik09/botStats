import { Body, Controller, Post } from '@nestjs/common';

import {AdminsService} from "./admins.service";
import {AdminLoginDto} from "./dto/adminLogin.dto";
import {TToken} from "../utils/types";
import {RegisterAdminDto} from "./dto/registerAdmin.dto";

@Controller('admins')
export class AdminsController {
  constructor(
      private adminsService: AdminsService,
  ) {}

  @Post('/login')
  async login(@Body() adminLoginDto: AdminLoginDto): Promise<TToken> {
    return await this.adminsService.login(adminLoginDto);
  }

  @Post()
  async register(@Body() registerAdminDto: RegisterAdminDto) {
    return await this.adminsService.createAdmin(registerAdminDto);
  }
}
