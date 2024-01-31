import {Injectable} from '@nestjs/common';
import {UserSessionRepository} from "./userSession.repository";
import {UserSession} from "./entity/userSession.entity";
import {UpdateUserSessionInfoDto} from "./dto/updateUserSession.dto";

@Injectable()
export class UserSessionService {
    constructor(private userSessionRepository: UserSessionRepository) {
    }

    async getPersonalInfoByTelegramId(telegramId: UserSession['telegramId']) {
        return await this.userSessionRepository.getPersonalInfoByTelegramId(telegramId)
    }

    async updateUserSessionInfo(telegramId: UserSession['telegramId'], updateUserSessionInfoDto: UpdateUserSessionInfoDto) {
        return await this.userSessionRepository.updateUserSessionInfo(telegramId, updateUserSessionInfoDto)
    }

    async updateLogSession(logSession: any, telegramId: UserSession['telegramId']) {
        return await this.userSessionRepository.updateLogSession(logSession, telegramId)
    }

    async updateStatus(status: UserSession['status'], telegramId: UserSession['telegramId']) {
        return await this.userSessionRepository.updateStatus(status, telegramId)
    }

    async updateKeywordsToUserSession(keywords: UserSession['keywords'], telegramId: UserSession['telegramId']) {
        return await this.userSessionRepository.updateKeywordsToUserSession(keywords, telegramId)
    }
}
