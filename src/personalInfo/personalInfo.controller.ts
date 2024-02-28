import {Body, Controller, Delete, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {UserSessionService} from "../userSession/userSession.service";
import {PersonalInfoService} from "./personalInfo.service";
import {UpdatePersonalInfoDto} from "./dto/updatePersonalInfo.dto";
import {PersonalInfo} from "./entity/personalInfo.entity";
import {UserSession} from "../userSession/entity/userSession.entity";
import {CreatePersonalInfoDto} from "./dto/createPersonalInfo.dto";
import {JwtGuard} from "../auth/jwtAuth.guard";

@Controller('personalInfo')
export class PersonalInfoController {
    constructor(
        private readonly personalInfoService: PersonalInfoService,
        private readonly userSessionService: UserSessionService
    ) {}

    @Post(':id')
    @UseGuards(JwtGuard)
    async createPersonalInfo(@Param('id') telegramId: UserSession['telegramId'], @Body() createPersonalInfoDto: CreatePersonalInfoDto): Promise<UserSession> {
        return await this.userSessionService.createUserSession(telegramId, createPersonalInfoDto);
    }

    @Patch(':id')
    @UseGuards(JwtGuard)
    async updatePersonalInfoByTelegramId(@Param('id') id: PersonalInfo['id'], @Body() updatePersonalInfoDto: UpdatePersonalInfoDto): Promise<number> {
        return await this.personalInfoService.updatePersonalInfoByTelegramId(id, updatePersonalInfoDto);
    }


    @Delete(':id')
    @UseGuards(JwtGuard)
    async deletePersonalInfoById(@Param('id') id: PersonalInfo['id']): Promise<number> {
        return await this.personalInfoService.deletePersonalInfoById(id);
    }
}
