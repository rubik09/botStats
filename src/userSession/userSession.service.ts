import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {UserSessionRepository} from "./userSession.repository";
import {UserSession} from "./entity/userSession.entity";
import {UpdateUserSessionInfoDto} from "./dto/updateUserSession.dto";
import {UpdateApiInfoDto} from "./dto/updateApiInfo.dto";

@Injectable()
export class UserSessionService {
    private readonly logger = new Logger(UserSessionService.name);
    constructor(private userSessionRepository: UserSessionRepository) {
    }


    async getPersonalInfoByTelegramId(telegramId: UserSession['telegramId']): Promise<UserSession> {
        this.logger.log(`Trying to get personal info by telegramId: ${telegramId}`);

        const userSession = await this.userSessionRepository.getUserSessionByTelegramId(telegramId);

        if (!userSession) {
            this.logger.log(`personal info with telegramId: ${telegramId} not found`);
            throw new HttpException(`personal info with telegramId: ${telegramId} not found`, HttpStatus.NOT_FOUND);
        }

        const personalInfo = await this.userSessionRepository.getPersonalInfoByTelegramId(telegramId);

        this.logger.log(`personal info successfully get`);

        return personalInfo
    }

    async updateUserSessionById(id: UserSession['id'], updateUserSessionInfoDto: UpdateUserSessionInfoDto): Promise<number> {
        this.logger.log(`Trying to update user session by id: ${id}`);

        const userSession = await this.userSessionRepository.getUserSessionById(id);

        if (!userSession) {
            this.logger.log(`user session with id: ${id} not found`);
            throw new HttpException(`user session with id: ${id} not found`, HttpStatus.NOT_FOUND);
        }

        const updatedUserSession = await this.userSessionRepository.updateUserSessionById(id, updateUserSessionInfoDto)

        this.logger.log(`user session successfully updated`);

        return updatedUserSession;
    }

    async updateUserSessionByTelegramId(telegramId: UserSession['telegramId'], updateUserSessionInfoDto: UpdateUserSessionInfoDto): Promise<number> {
        this.logger.log(`Trying to update user session by telegramId: ${telegramId}`);

        const userSession = await this.userSessionRepository.getUserSessionByTelegramId(telegramId);

        if (!userSession) {
            this.logger.log(`user session with telegramId: ${telegramId} not found`);
            throw new HttpException(`user session with telegramId: ${telegramId} not found`, HttpStatus.NOT_FOUND);
        }

        const updatedUserSession = await this.userSessionRepository.updateUserSessionByTelegramId(telegramId, updateUserSessionInfoDto);

        this.logger.log(`user session successfully updated`);

        return updatedUserSession;
    }

    async updateUserSessionByApiId(apiId: UserSession['apiId'], updateUserSessionInfoDto: UpdateUserSessionInfoDto): Promise<number> {
        this.logger.log(`Trying to update user session by apiId: ${apiId}`);

        const userSession = await this.userSessionRepository.getUserSessionByApiId(apiId);

        if (!userSession) {
            this.logger.log(`user session with apiId: ${apiId} not found`);
            throw new HttpException(`user session with apiId: ${apiId} not found`, HttpStatus.NOT_FOUND);
        }

        const updatedUserSession = await this.userSessionRepository.updateUserSessionByApiId(apiId, updateUserSessionInfoDto)

        this.logger.log(`user session successfully updated`);

        return updatedUserSession;
    }

    async updateApiInfoByTelegramId(telegramId: UserSession['telegramId'], updateApiInfoDto: UpdateApiInfoDto): Promise<number> {
        this.logger.log(`Trying to update api info by telegramId: ${telegramId}`);

        const userSession = await this.userSessionRepository.getUserSessionByTelegramId(telegramId);

        if (!userSession) {
            this.logger.log(`user session with telegramId: ${telegramId} not found`);
            throw new HttpException(`user session with telegramId: ${telegramId} not found`, HttpStatus.NOT_FOUND);
        }

        const updatedUserSession = await this.userSessionRepository.updateApiInfoByTelegramId(telegramId, updateApiInfoDto)

        this.logger.log(`api info successfully updated`);

        return updatedUserSession;
    }

}
