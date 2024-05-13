import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UpdateUserSessionInfoDto } from './dto/updateUserSession.dto';
import { UserSession } from './entity/userSession.entity';
import { UserSessionService } from './userSession.service';
import { CreatePersonalInfoDto } from '../personalInfo/dto/createPersonalInfo.dto';

@UseGuards(AuthGuard)
@Controller('sessions')
export class UserSessionController {
  constructor(private readonly userSessionService: UserSessionService) {}

  @Get()
  async getAllUserSessions(): Promise<UserSession[]> {
    return this.userSessionService.getAllUserSessions();
  }

  @Post(':id')
  async createPersonalInfoAndUserSession(
    @Param('id') telegramId: UserSession['telegramId'],
    @Body() createPersonalInfoDto: CreatePersonalInfoDto,
  ) {
    await this.userSessionService.createUserSessionTransaction(telegramId, createPersonalInfoDto);
    throw new HttpException('Персональная информация и сессия успешно созданы', HttpStatus.CREATED);
  }

  @Patch(':id')
  async updateUserSessionByTelegramId(
    @Param('id') telegramId: UserSession['telegramId'],
    @Body() body: UpdateUserSessionInfoDto,
  ) {
    await this.userSessionService.updateUserSessionByTelegramId(telegramId, body);
    throw new HttpException('Сессия успешно обновлена', HttpStatus.OK);
  }
}
