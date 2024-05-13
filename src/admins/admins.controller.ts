import { Body, Controller, Post } from '@nestjs/common';

import { AdminsService } from './admins.service';
import { AdminLoginDto } from './dto/adminLogin.dto';
import { RegisterAdminDto } from './dto/registerAdmin.dto';
import { TTokenRole } from '../utils/types';

@Controller('admins')
export class AdminsController {
  constructor(private adminsService: AdminsService) {}

  @Post('/login')
  async login(@Body() adminLoginDto: AdminLoginDto): Promise<TTokenRole> {
    return await this.adminsService.login(adminLoginDto);
  }

  @Post()
  async register(@Body() registerAdminDto: RegisterAdminDto) {
    await this.adminsService.createAdmin(registerAdminDto);
  }
}
