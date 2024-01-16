import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Sessions} from "./entity/sessions";
import {SaveMainInfoDto} from "./dto/saveMainInfo.dto";
import {UpdateSessionDto} from "./dto/updateSession.dto";
import {UpdateSessionInfoDto} from "./dto/updateSessionInfo.dto";

@Injectable()
export class SessionsRepository {
    constructor(
        @InjectRepository(Sessions)
        private readonly sessionsRepository: Repository<Sessions>,
    ) {
    }

    async updateStatus(status: Sessions['status'], userId: Sessions['userId']): Promise<void> {
        await this.sessionsRepository.update({userId}, {status});
    }

    async getStatusById(id: Sessions['id']): Promise<Sessions> {
        return await this.sessionsRepository.findOne({where: {id}, select: ['status']});
    }

    async checkByPhone(phoneNumber: Sessions['phoneNumber']): Promise<Sessions> {
        return await this.sessionsRepository.findOne({where: {phoneNumber}});
    }

    async checkByUserId(userId: Sessions['userId']): Promise<Sessions> {
        return await this.sessionsRepository.findOne({where: {userId}});
    }

    async checkByUsername(username: Sessions['username']): Promise<Sessions> {
        return await this.sessionsRepository.findOne({where: {username}});
    }

    async getSessions(): Promise<Sessions[]> {
        return await this.sessionsRepository.find();
    }

    async saveMainInfo(saveMainInfoDto: SaveMainInfoDto): Promise<void> {
        const newSession = this.sessionsRepository.create(saveMainInfoDto);
        await this.sessionsRepository.save(newSession);
    }

    async updateLogSession(logSession: Sessions['logSession'], userId: Sessions['userId']): Promise<void> {
        await this.sessionsRepository.update({userId}, {logSession});
    }

    async updateSessionInfo(userId: Sessions['userId'], updateSessionInfoDto: UpdateSessionInfoDto): Promise<void> {
        await this.sessionsRepository.update({userId}, updateSessionInfoDto);
    }

    async updateKeywordsToSession(keywords: Sessions['keywords'], userId: Sessions['userId']): Promise<void> {
        await this.sessionsRepository.update({userId}, {keywords});
    }

    async updateKeywordsToSessionByApiId(keywords: Sessions['keywords'], apiId: Sessions['apiId']): Promise<void> {
        await this.sessionsRepository.update({apiId}, {keywords});
    }

    async changeStatus(id: Sessions['id'], status: Sessions['status']): Promise<void> {
        await this.sessionsRepository.update({id}, {status});
    }

    async getKeywordsFromSession(apiId: Sessions['apiId']): Promise<Sessions> {
        return await this.sessionsRepository.findOne({where: {apiId}, select: ['keywords']});
    }

    async getUsernameFromSession(apiId: Sessions['apiId']): Promise<Sessions> {
        return await this.sessionsRepository.findOne({where: {apiId}, select: ['username']});
    }

    async getMainInfoById(id: Sessions['id']): Promise<Pick<Sessions, 'apiId' | 'apiHash' | 'logSession' | 'userId'>> {
        return this.sessionsRepository.findOne({
            where: {id},
            select: ['apiId', 'apiHash', 'logSession', 'userId'],
        });
    }

    async getMainInfoByUserId(userId: Sessions['userId']): Promise<Pick<Sessions, 'apiId' | 'apiHash' | 'logSession' | 'userId'>> {
        return await this.sessionsRepository.findOne({
            where: {userId},
            select: ['apiId', 'apiHash', 'logSession', 'userId'],
        });
    }

    async deleteSession(id: Sessions['id']): Promise<void> {
        await this.sessionsRepository.delete(id);
    }

    async getPhoneById(userId: Sessions['userId']): Promise<Sessions> {
        return await this.sessionsRepository.findOne({where: {userId}, select: ['phoneNumber'],});
    }

    async getSessionById(id: Sessions['id']): Promise<Sessions | undefined> {
        return await this.sessionsRepository.findOne({where: {id}});
    }

    async updateSessionById(id: Sessions['id'], updateSessionDto: UpdateSessionDto) {
        await this.sessionsRepository.update({id}, updateSessionDto);
    }

    async getStatus(): Promise<Sessions[]> {
        return await this.sessionsRepository.find({where: {status: true}});
    }
}
