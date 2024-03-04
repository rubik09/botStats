import { Body, Controller, Post } from '@nestjs/common';

import { CreateAdminDto } from './dto/createAdmin.dto';
import { AuthService } from '../auth/auth.service';

@Controller('admins')
export class AdminsController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() adminInfo: CreateAdminDto) {
    const token = await this.authService.login(adminInfo);
    return { token };
  }

  @Post('/register')
  async register(@Body() createAdminDto: CreateAdminDto) {
    const token = await this.authService.register(createAdminDto);
    return { token };
  }
}
