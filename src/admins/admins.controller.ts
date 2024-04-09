import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from '../auth/auth.service';
import {TAdminEmailAndPassword} from "../utils/types";

@Controller('admins')
export class AdminsController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginAdmin: TAdminEmailAndPassword) {
    const token = await this.authService.login(loginAdmin);
    return { token };
  }

  @Post('/register')
  async register(@Body() createAdminDto: TAdminEmailAndPassword) {
    const token = await this.authService.register(createAdminDto);
    return { token };
  }
}
