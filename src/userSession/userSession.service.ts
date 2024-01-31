import {Injectable} from '@nestjs/common';
import {UserSessionRepository} from "./userSession.repository";
import {UserSession} from "./entity/userSession.entity";
import {UpdateUserSessionInfoDto} from "./dto/updateUserSession.dto";
import {UpdateApiInfoDto} from "./dto/updateApiInfo.dto";

@Injectable()
export class UserSessionService {
    constructor(private userSessionRepository: UserSessionRepository) {
    }

    async getPersonalInfoByTelegramId(telegramId: UserSession['telegramId']) {
        return await this.userSessionRepository.getPersonalInfoByTelegramId(telegramId)
    }

    async updateUserSessionById(id: UserSession['id'], updateUserSessionInfoDto: UpdateUserSessionInfoDto) {
        return await this.userSessionRepository.updateUserSessionById(id, updateUserSessionInfoDto)
    }

    async updateUserSessionByTelegramId(telegramId: UserSession['telegramId'], updateUserSessionInfoDto: UpdateUserSessionInfoDto) {
        return await this.userSessionRepository.updateUserSessionByTelegramId(telegramId, updateUserSessionInfoDto)
    }

    async updateUserSessionByApiId(apiId: UserSession['apiId'], updateUserSessionInfoDto: UpdateUserSessionInfoDto) {
        return await this.userSessionRepository.updateUserSessionByApiId(apiId, updateUserSessionInfoDto)
    }

    async updateApiInfoByTelegramId(telegramId: UserSession['telegramId'], updateApiInfoDto: UpdateApiInfoDto) {
        return await this.userSessionRepository.updateApiInfoByTelegramId(telegramId, updateApiInfoDto)
    }

}
