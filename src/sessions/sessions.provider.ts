import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {SessionsEntity} from "./entity/sessions.entity";
import {SaveMainInfoDto, UpdateClientDto, UpdateSessionInfoDto} from "./dto/sessions.dto";

@Injectable()
export class SessionsProvider {
    constructor(
        @InjectRepository(SessionsEntity)
        private readonly sessionsRepository: Repository<SessionsEntity>,
    ) {
    }

    async updateStatus(status: boolean, user_id: string): Promise<void> {
        await this.sessionsRepository.update({user_id}, {status});
    }

    async getStatusById(id: number): Promise<boolean> {
        const session = await this.sessionsRepository.findOne({where: {id}});
        return session?.status;
    }

    async checkByPhone(phone_number: string): Promise<SessionsEntity> {
        return this.sessionsRepository.findOne({where: {phone_number}});
    }

    async checkByUserId(user_id: string): Promise<SessionsEntity> {
        return this.sessionsRepository.findOne({where: {user_id}});
    }

    async checkByUsername(username: string): Promise<SessionsEntity> {
        return this.sessionsRepository.findOne({where: {username}});
    }

    async getSessions(): Promise<SessionsEntity[]> {
        return this.sessionsRepository.find();
    }

    async saveMainInfo(saveMainInfoDto: SaveMainInfoDto): Promise<void> {
        const newSession = this.sessionsRepository.create(saveMainInfoDto);
        await this.sessionsRepository.save(newSession);
    }

    async updateLogSession(log_session: string, user_id: string): Promise<void> {
        await this.sessionsRepository.update({user_id}, {log_session});
    }

    async updateSessionInfo(user_id: string, updateSessionInfoDto: UpdateSessionInfoDto): Promise<void> {
        await this.sessionsRepository.update({user_id}, updateSessionInfoDto);
    }

    async updateKeywordsToSession(keywords: string, user_id: string): Promise<void> {
        await this.sessionsRepository.update({user_id}, {keywords});
    }

    async updateKeywordsToSessionByApiId(keywords: string, api_id: string): Promise<void> {
        await this.sessionsRepository.update({api_id}, {keywords});
    }

    async changeStatus(id: number, status: boolean): Promise<void> {
        await this.sessionsRepository.update({id}, {status});
    }

    async getKeywordsFromSession(api_id: string): Promise<string> {
        const session = await this.sessionsRepository.findOne({where: {api_id}});
        return session?.keywords;
    }

    async getUsernameFromSession(api_id: string): Promise<string | undefined> {
        const session = await this.sessionsRepository.findOne({where: {api_id}});
        return session?.username;
    }

    async getMainInfoById(id: number): Promise<Pick<SessionsEntity, 'api_id' | 'api_hash' | 'log_session' | 'user_id'>> {
        return this.sessionsRepository.findOne({
            where: {id},
            select: ['api_id', 'api_hash', 'log_session', 'user_id'],
        });
    }

    async getMainInfoByUserId(user_id: string): Promise<Pick<SessionsEntity, 'api_id' | 'api_hash' | 'log_session' | 'user_id'>> {
        return this.sessionsRepository.findOne({
            where: {user_id},
            select: ['api_id', 'api_hash', 'log_session', 'user_id'],
        });
    }

    async deleteClient(id: number): Promise<void> {
        await this.sessionsRepository.delete(id);
    }

    async getPhoneById(user_id: string): Promise<string | undefined> {
        const session = await this.sessionsRepository.findOne({where: {user_id}});
        return session?.phone_number;
    }

    async getClientById(id: number): Promise<SessionsEntity | undefined> {
        return this.sessionsRepository.findOne({where: {id}});
    }

    async updateClientById(id: number, updateClientDto: UpdateClientDto): Promise<void> {
        await this.sessionsRepository.update({id}, updateClientDto);
    }

    async getStatus(): Promise<SessionsEntity> {
        return this.sessionsRepository.findOne({where: {status: true}});
    }
}
