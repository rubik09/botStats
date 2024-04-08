import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CreatePersonalInfoDto } from "../personalInfo/dto/createPersonalInfo.dto";

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

  @Post(':id')
  @UseGuards(JwtGuard)
  async createPersonalInfoAndUserSession(
    @Param('id') telegramId: UserSession['telegramId'],
    @Body() createPersonalInfoDto: CreatePersonalInfoDto,
  ) {
    await this.userSessionService.createUserSession(telegramId, createPersonalInfoDto);
    throw new HttpException('Персональная информация успешно создана', HttpStatus.CREATED);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  async updateUserSessionByTelegramId(
    @Param('id') telegramId: UserSession['telegramId'],
    @Body() body: UpdateUserSessionInfoDto,
  ) {
    await this.userSessionService.updateUserSessionByTelegramId(telegramId, body);
    throw new HttpException('Сессия успешно обновлена', HttpStatus.OK);

  }
}
