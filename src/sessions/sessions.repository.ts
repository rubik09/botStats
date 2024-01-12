import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Sessions} from "./entity/sessions";
import {SaveMainInfoDto} from "./dto/saveMainInfo.dto";
import {UpdateSessionDto} from "./dto/updateSession.dto";

@Injectable()
export class SessionsRepository {
    constructor(
        @InjectRepository(Sessions)
        private readonly sessionsRepository: Repository<Sessions>,
    ) {
    }

    async updateStatus(status: boolean, userId: number): Promise<void> {
        await this.sessionsRepository.update({userId}, {status});
    }

    async getStatusById(id: number): Promise<Sessions> {
        return await this.sessionsRepository.findOne({where: {id}, select: ['status']});
    }

    async checkByPhone(phoneNumber: string): Promise<Sessions> {
        return await this.sessionsRepository.findOne({where: {phoneNumber}});
    }

    async checkByUserId(userId: number): Promise<Sessions> {
        return await this.sessionsRepository.findOne({where: {userId}});
    }

    async checkByUsername(username: string): Promise<Sessions> {
        return await this.sessionsRepository.findOne({where: {username}});
    }

    async getSessions(): Promise<Sessions[]> {
        return await this.sessionsRepository.find();
    }

    async saveMainInfo(saveMainInfoDto: SaveMainInfoDto): Promise<void> {
        const newSession = this.sessionsRepository.create(saveMainInfoDto);
        await this.sessionsRepository.save(newSession);
    }

    async updateLogSession(logSession: string, userId: number): Promise<void> {
        await this.sessionsRepository.update({userId}, {logSession});
    }

    async updateSessionInfo(userId: number, updateSessionDto: UpdateSessionDto): Promise<void> {
        await this.sessionsRepository.update({userId}, updateSessionDto);
    }

    async updateKeywordsToSession(keywords: string, userId: number): Promise<void> {
        await this.sessionsRepository.update({userId}, {keywords});
    }

    async updateKeywordsToSessionByApiId(keywords: string, apiId: number): Promise<void> {
        await this.sessionsRepository.update({apiId}, {keywords});
    }

    async changeStatus(id: number, status: boolean): Promise<void> {
        await this.sessionsRepository.update({id}, {status});
    }

    async getKeywordsFromSession(apiId: number): Promise<Sessions> {
        return await this.sessionsRepository.findOne({where: {apiId}, select: ['keywords']});
    }

    async getUsernameFromSession(apiId: number): Promise<Sessions> {
        return await this.sessionsRepository.findOne({where: {apiId}, select: ['username']});
    }

    async getMainInfoById(id: number): Promise<Pick<Sessions, 'apiId' | 'apiHash' | 'logSession' | 'userId'>> {
        return this.sessionsRepository.findOne({
            where: {id},
            select: ['apiId', 'apiHash', 'logSession', 'userId'],
        });
    }

    async getMainInfoByUserId(userId: number): Promise<Pick<Sessions, 'apiId' | 'apiHash' | 'logSession' | 'userId'>> {
        return await this.sessionsRepository.findOne({
            where: {userId},
            select: ['apiId', 'apiHash', 'logSession', 'userId'],
        });
    }

    async deleteSession(id: number): Promise<void> {
        await this.sessionsRepository.delete(id);
    }

    async getPhoneById(userId: number): Promise<Sessions> {
        return await this.sessionsRepository.findOne({where: {userId}, select: ['phoneNumber'],});
    }

    async getSessionById(id: number): Promise<Sessions | undefined> {
        return await this.sessionsRepository.findOne({where: {id}});
    }

    async updateSessionById(id: number, updateSessionDto: UpdateSessionDto): Promise<void> {
        await this.sessionsRepository.update({id}, updateSessionDto);
    }

    async getStatus(): Promise<Sessions> {
        return await this.sessionsRepository.findOne({where: {status: true}});
    }
}
