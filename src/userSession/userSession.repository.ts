import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserSession, userSessionStatus} from "./entity/userSession.entity";
import {Repository} from "typeorm";
import {UpdateUserSessionInfoDto} from "./dto/updateUserSession.dto";
import {DeleteUserSessionDto} from "./dto/deleteUserSession.dto";
import {UpdateApiInfoDto} from "./dto/updateApiInfo.dto";
import {CreatePersonalInfoDto} from "../personalInfo/dto/createPersonalInfo.dto";

@Injectable()
export class UserSessionRepository {
    constructor(
        @InjectRepository(UserSession)
        private readonly userSessionRepository: Repository<UserSession>,
    ) {
    }

    async getStatusById(id: UserSession['id']): Promise<UserSession> {
        return await this.userSessionRepository.findOne({where: {id}, select: ['id', 'status']});
    }

    async getUserSessions(): Promise<UserSession[]> {
        return await this.userSessionRepository.find();
    }

    async createUserSession(telegramId: UserSession['telegramId'], personalInfo: CreatePersonalInfoDto): Promise<UserSession> {
        return await this.userSessionRepository.save({telegramId, personalInfo});
    }


    async getKeywordsFromUserSessionByApiId(apiId: UserSession['apiId']): Promise<UserSession> {
        return await this.userSessionRepository.findOne({where: {apiId}, select: ['id', 'keywords']});
    }

    async getMainInfoById(id: UserSession['id']): Promise<UserSession> {
        return this.userSessionRepository.findOne({
            where: {id},
            select: ['id', 'apiId', 'apiHash', 'logSession', 'telegramId'],
        });
    }

    async getPersonalInfoByTelegramId(telegramId: UserSession['telegramId']): Promise<UserSession> {
        return await this.userSessionRepository.findOne({
            where: {telegramId},
            select: ['personalInfo'],
        });
    }

    async getPersonalInfoByApiId(apiId: UserSession['apiId']): Promise<UserSession> {
        return await this.userSessionRepository.findOne({
            where: {apiId},
            select: ['personalInfo'],
        });
    }

    async deleteUserSessionById(deleteUserSessionDto: DeleteUserSessionDto): Promise<number> {
        const {affected} = await this.userSessionRepository.delete(deleteUserSessionDto);
        return affected;
    }

    async deleteUserSessionByTelegramId(telegramId: UserSession['telegramId']): Promise<number> {
        const {affected} = await this.userSessionRepository.delete({telegramId});
        return affected;
    }

    async getUserSessionById(id: UserSession['id']): Promise<UserSession> {
        return await this.userSessionRepository.findOne({where: {id}});
    }

    async getUserSessionByTelegramId(telegramId: UserSession['telegramId']): Promise<UserSession> {
        return await this.userSessionRepository.findOne({where: {telegramId}});
    }

    async getUserSessionByApiId(apiId: UserSession['apiId']): Promise<UserSession> {
        return await this.userSessionRepository.findOne({where: {apiId}});
    }

    async updateUserSessionById(id: UserSession['id'], updateUserSessionInfoDto: UpdateUserSessionInfoDto): Promise<number> {
        const {affected} = await this.userSessionRepository.update({id}, updateUserSessionInfoDto);
        return affected;
    }

    async updateUserSessionByTelegramId(telegramId: UserSession['telegramId'], updateUserSessionInfoDto: UpdateUserSessionInfoDto): Promise<number> {
        const {affected} = await this.userSessionRepository.update({telegramId}, updateUserSessionInfoDto);
        return affected;
    }

    async updateUserSessionByApiId(apiId: UserSession['apiId'], updateUserSessionInfoDto: UpdateUserSessionInfoDto): Promise<number> {
        const {affected} = await this.userSessionRepository.update({apiId}, updateUserSessionInfoDto);
        return affected;
    }

    async updateApiInfoByTelegramId(telegramId: UserSession['telegramId'], updateApiInfoDto: UpdateApiInfoDto): Promise<number> {
        const {affected} = await this.userSessionRepository.update({telegramId}, updateApiInfoDto);
        return affected;
    }

    async getActiveUserSessions(): Promise<UserSession[]> {
        return await this.userSessionRepository.find({where: {status: userSessionStatus.ACTIVE}});
    }
}
