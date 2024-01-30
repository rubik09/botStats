import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserSession, userSessionStatus} from "./entity/userSession.entity";
import {Repository} from "typeorm";
import {UpdateUserSessionInfoDto} from "./dto/updateUserSession.dto";
import {CreateUserSessionInfoDto} from "./dto/createUserSessionInfo.dto";
import {DeleteUserSessionDto} from "./dto/deleteUserSession.dto";

@Injectable()
export class UserSessionRepository {
    constructor(
        @InjectRepository(UserSession)
        private readonly userSessionRepository: Repository<UserSession>,
    ) {
    }

    async updateStatus(status: UserSession['status'], telegramId: UserSession['telegramId']): Promise<number> {
        const {affected} = await this.userSessionRepository.update({telegramId}, {status});
        return affected;
    }

    async getStatusById(id: UserSession['id']): Promise<UserSession> {
        return await this.userSessionRepository.findOne({where: {id}, select: ['id', 'status']});
    }

    async getUserSession(): Promise<UserSession[]> {
        return await this.userSessionRepository.find();
    }

    async createUserSession(createUserSessionInfoDto: CreateUserSessionInfoDto): Promise<UserSession> {
        return await this.userSessionRepository.save(createUserSessionInfoDto);
    }

    async updateLogSession(logSession: any, telegramId: UserSession['telegramId']): Promise<number> {
        const {affected} = await this.userSessionRepository.update({telegramId}, {logSession});
        return affected;
    }

    async updateUserSessionInfo(telegramId: UserSession['telegramId'], updateUserSessionInfoDto: UpdateUserSessionInfoDto): Promise<number> {
        const {affected} = await this.userSessionRepository.update({telegramId}, updateUserSessionInfoDto);
        return affected;
    }

    async updateKeywordsToUserSession(keywords: UserSession['keywords'], telegramId: UserSession['telegramId']): Promise<number> {
        const {affected} = await this.userSessionRepository.update({telegramId}, {keywords});
        return affected;
    }

    async updateKeywordsToUserSessionByApiId(keywords: UserSession['keywords'], apiId: UserSession['apiId']): Promise<number> {
        const {affected} = await this.userSessionRepository.update({apiId}, {keywords});
        return affected;
    }

    async changeStatus(id: UserSession['id'], status: UserSession['status']): Promise<number> {
        const {affected} = await this.userSessionRepository.update({id}, {status});
        return affected;
    }

    async getKeywordsFromUserSession(apiId: UserSession['apiId']): Promise<UserSession> {
        return await this.userSessionRepository.findOne({where: {apiId}, select: ['id', 'keywords']});
    }

    async getMainInfoById(id: UserSession['id']): Promise<UserSession> {
        return this.userSessionRepository.findOne({
            where: {id},
            select: ['id', 'apiId', 'apiHash', 'logSession', 'telegramId'],
        });
    }

    async getMainInfoByTelegramId(telegramId: UserSession['telegramId']): Promise<UserSession> {
        return await this.userSessionRepository.findOne({
            where: {telegramId},
            select: ['id', 'apiId', 'apiHash', 'logSession', 'telegramId'],
            relations: ['personalInfo'],
        });
    }

    async deleteUserSession(deleteUserSessionDto: DeleteUserSessionDto): Promise<number> {
        const {affected} = await this.userSessionRepository.delete(deleteUserSessionDto);
        return affected;
    }

    async getUserSessionById(id: UserSession['id']): Promise<UserSession> {
        return await this.userSessionRepository.findOne({where: {id}});
    }

    async updateUserSessionById(id: UserSession['id'], updateUserSessionInfoDto: UpdateUserSessionInfoDto): Promise<number> {
        const {affected} = await this.userSessionRepository.update({id}, updateUserSessionInfoDto);
        return affected;
    }

    async getActiveUserSessions(): Promise<UserSession[]> {
        return await this.userSessionRepository.find({where: {status: userSessionStatus.ACTIVE}});
    }
}
