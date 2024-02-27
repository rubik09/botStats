import {Body, Controller, Delete, Param, Patch, Post} from '@nestjs/common';
import {UserSessionService} from "../userSession/userSession.service";
import {PersonalInfoService} from "./personalInfo.service";
import {UpdatePersonalInfoDto} from "./dto/updatePersonalInfo.dto";
import {PersonalInfo} from "./entity/personalInfo.entity";
import {UserSession} from "../userSession/entity/userSession.entity";
import {CreatePersonalInfoDto} from "./dto/createPersonalInfo.dto";

@Controller('personalInfo')
export class PersonalInfoController {
    constructor(
        private readonly personalInfoService: PersonalInfoService,
        private readonly userSessionService: UserSessionService
    ) {}

    @Post('/:id')
    // @UseGuards(JwtGuard)
    async createPersonalInfo(@Param('id') telegramId: UserSession['telegramId'], @Body() createPersonalInfoDto: CreatePersonalInfoDto) {
        const newSession = {telegramId, personalInfo: createPersonalInfoDto}
        return await this.userSessionService.createUserSession(newSession);
    }

    @Patch('/:id')
    // @UseGuards(JwtGuard)
    async updatePersonalInfoByTelegramId(@Param('id') id: PersonalInfo['id'], @Body() updatePersonalInfoDto: UpdatePersonalInfoDto) {
        return await this.personalInfoService.updatePersonalInfoByTelegramId(id, updatePersonalInfoDto);
    }


    @Delete('/:id')
    // @UseGuards(JwtGuard)
    async deletePersonalInfoById(@Param('id') id: PersonalInfo['id']) {
        return await this.personalInfoService.deletePersonalInfoById(id);
    }
}
