import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { AdminRoles } from './admins.constants';
import { AdminsService } from './admins.service';
import { AdminLoginDto } from './dto/adminLogin.dto';
import { RegisterAdminDto } from './dto/registerAdmin.dto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('admins')
export class AdminsController {
  constructor(private adminsService: AdminsService) {}

  @Post('/login')
  async login(@Body() adminLoginDto: AdminLoginDto): Promise<AdminRoles> {
    return await this.adminsService.login(adminLoginDto);
  }

  @Post()
  async register(@Body() registerAdminDto: RegisterAdminDto) {
    await this.adminsService.createAdmin(registerAdminDto);
  }
}
