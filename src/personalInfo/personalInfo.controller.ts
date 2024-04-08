import {Body, Controller, Delete, HttpException, HttpStatus, Param, Patch, Post, UseGuards} from '@nestjs/common';

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
  ) {}

  @Patch(':id')
  @UseGuards(JwtGuard)
  async updatePersonalInfoByTelegramId(
    @Param('id') id: PersonalInfo['id'],
    @Body() updatePersonalInfoDto: UpdatePersonalInfoDto,
  ) {
    await this.personalInfoService.updatePersonalInfoByTelegramId(id, updatePersonalInfoDto);
    throw new HttpException('Персональная информация успешно обновлена', HttpStatus.OK);

  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deletePersonalInfoById(@Param('id') id: PersonalInfo['id']) {
    await this.personalInfoService.deletePersonalInfoById(id);
    throw new HttpException('Персональная информация успешно удалена', HttpStatus.OK);

  }
}
