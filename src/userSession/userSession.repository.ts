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

    async updateStatus(status: UserSession['status'], telegramId: UserSession['telegramId']): Promise<void> {
        await this.userSessionRepository.update({telegramId}, {status});
    }

    async getStatusById(id: UserSession['id']): Promise<UserSession> {
        return await this.userSessionRepository.findOne({where: {id}, select: ['status']});
    }

    async getUserSession(): Promise<UserSession[]> {
        return await this.userSessionRepository.find();
    }

    async createUserSession(createUserSessionInfoDto: CreateUserSessionInfoDto): Promise<void> {
        const newSession = this.userSessionRepository.create(createUserSessionInfoDto);
        await this.userSessionRepository.save(newSession);
    }

    async updateLogSession(logSession: UserSession['logSession'], telegramId: UserSession['telegramId']): Promise<void> {
        await this.userSessionRepository.update({telegramId}, {logSession});
    }

    async updateUserSessionInfo(telegramId: UserSession['telegramId'], updateUserSessionInfoDto: UpdateUserSessionInfoDto): Promise<void> {
        await this.userSessionRepository.update({telegramId}, updateUserSessionInfoDto);
    }

    async updateKeywordsToUserSession(keywords: UserSession['keywords'], telegramId: UserSession['telegramId']): Promise<void> {
        await this.userSessionRepository.update({telegramId}, {keywords});
    }

    async updateKeywordsToUserSessionByApiId(keywords: UserSession['keywords'], apiId: UserSession['apiId']): Promise<void> {
        await this.userSessionRepository.update({apiId}, {keywords});
    }

    async changeStatus(id: UserSession['id'], status: UserSession['status']): Promise<void> {
        await this.userSessionRepository.update({id}, {status});
    }

    async getKeywordsFromUserSession(apiId: UserSession['apiId']): Promise<UserSession> {
        return await this.userSessionRepository.findOne({where: {apiId}, select: ['keywords']});
    }

    async getMainInfoById(id: UserSession['id']): Promise<Pick<UserSession, 'apiId' | 'apiHash' | 'logSession' | 'telegramId'>> {
        return this.userSessionRepository.findOne({
            where: {id},
            select: ['apiId', 'apiHash', 'logSession', 'telegramId'],
        });
    }

    async getMainInfoByUserId(telegramId: UserSession['telegramId']): Promise<Pick<UserSession, 'apiId' | 'apiHash' | 'logSession' | 'telegramId'>> {
        return await this.userSessionRepository.findOne({
            where: {telegramId},
            select: ['apiId', 'apiHash', 'logSession', 'telegramId'],
        });
    }

    async deleteUserSession(deleteUserSessionDto: DeleteUserSessionDto): Promise<void> {
        await this.userSessionRepository.delete(deleteUserSessionDto);
    }

    async getUserSessionById(id: UserSession['id']): Promise<UserSession | undefined> {
        return await this.userSessionRepository.findOne({where: {id}});
    }

    async updateUserSessionById(id: UserSession['id'], updateUserSessionInfoDto: UpdateUserSessionInfoDto) {
        await this.userSessionRepository.update({id}, updateUserSessionInfoDto);
    }

    async getActiveUserSessions(): Promise<UserSession[]> {
        return await this.userSessionRepository.find({where: {status: userSessionStatus.ACTIVE}});
    }
}
