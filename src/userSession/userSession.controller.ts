import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';

import { UpdateUserSessionInfoDto } from './dto/updateUserSession.dto';
import { UserSession } from './entity/userSession.entity';
import { UserSessionService } from './userSession.service';
import { JwtGuard } from '../auth/jwtAuth.guard';

@Controller('sessions')
export class UserSessionController {
  constructor(private readonly userSessionService: UserSessionService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getAllUserSessions(): Promise<UserSession[]> {
    return this.userSessionService.getAllUserSessions();
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  async updateUserSessionByTelegramId(
    @Param('id') telegramId: UserSession['telegramId'],
    @Body() body: UpdateUserSessionInfoDto,
  ): Promise<number> {
    return this.userSessionService.updateUserSessionByTelegramId(telegramId, body);
  }
}
