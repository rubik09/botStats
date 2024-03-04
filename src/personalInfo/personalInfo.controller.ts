import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { CreatePersonalInfoDto } from './dto/createPersonalInfo.dto';
import { UpdatePersonalInfoDto } from './dto/updatePersonalInfo.dto';
import { PersonalInfo } from './entity/personalInfo.entity';
import { PersonalInfoService } from './personalInfo.service';
import { JwtGuard } from '../auth/jwtAuth.guard';
import { UserSession } from '../userSession/entity/userSession.entity';
import { UserSessionService } from '../userSession/userSession.service';

@Controller('personalInfo')
export class PersonalInfoController {
  constructor(
    private readonly personalInfoService: PersonalInfoService,
    private readonly userSessionService: UserSessionService,
  ) {}

  @Post(':id')
  @UseGuards(JwtGuard)
  async createPersonalInfo(
    @Param('id') telegramId: UserSession['telegramId'],
    @Body() createPersonalInfoDto: CreatePersonalInfoDto,
  ): Promise<UserSession> {
    return this.userSessionService.createUserSession(telegramId, createPersonalInfoDto);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  async updatePersonalInfoByTelegramId(
    @Param('id') id: PersonalInfo['id'],
    @Body() updatePersonalInfoDto: UpdatePersonalInfoDto,
  ): Promise<number> {
    return this.personalInfoService.updatePersonalInfoByTelegramId(id, updatePersonalInfoDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deletePersonalInfoById(@Param('id') id: PersonalInfo['id']): Promise<number> {
    return this.personalInfoService.deletePersonalInfoById(id);
  }
}
