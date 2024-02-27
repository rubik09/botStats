import {Body, Controller, Get, Param, Patch} from '@nestjs/common';
import {UserSessionService} from "./userSession.service";
import {UpdateUserSessionInfoDto} from "./dto/updateUserSession.dto";
import {UserSession} from "./entity/userSession.entity";
import {JwtGuard} from "../auth/jwtAuth.guard";

@Controller('sessions')
export class UserSessionController {
    constructor(private readonly userSessionService: UserSessionService) {}

    @Get('')
    // @UseGuards(JwtGuard)
    async getAllUserSessions() {
        return await this.userSessionService.getAllUserSessions();
    }

    @Patch('/:id')
    // @UseGuards(JwtGuard)
    async updateUserSessionByTelegramId(@Param('id') telegramId: UserSession['telegramId'], @Body() body: UpdateUserSessionInfoDto) {
        return await this.userSessionService.updateUserSessionByTelegramId(telegramId, body);
    }
}
