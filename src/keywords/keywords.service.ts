import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {UserSession} from "../userSession/entity/userSession.entity";
import {CreateKeywordsDto} from "./dto/createKeywords.dto";
import {UserSessionRepository} from "../userSession/userSession.repository";
import {KeywordsRepository} from "./keywords.repository";
import {Keywords} from "./entity/keywords.entity";
import {UpdateKeywordsDto} from "./dto/updateKeywords.dto";

@Injectable()
export class KeywordsService {
    private readonly logger = new Logger(KeywordsService.name);
    constructor(
        private userSessionRepository: UserSessionRepository,
        private keywordsRepository: KeywordsRepository
    ) {}

    async createNewKeyword(
        telegramId: UserSession['telegramId'],
        createKeywordsDto: CreateKeywordsDto
    ): Promise<Keywords> {
        this.logger.log(`Trying to create keyword`);

        const userSession = await this.userSessionRepository.getUserSessionByTelegramId(telegramId);

        if (!userSession) {
            this.logger.error(`session with telegramId: ${telegramId} not exist`);
            throw new HttpException(`session with telegramId: ${telegramId} not exist`, HttpStatus.BAD_REQUEST);
        }

        const keywordDto: CreateKeywordsDto = {
           ...createKeywordsDto,
            userSession
        };

        const newKeyword = await this.keywordsRepository.createNewKeyword(keywordDto);

        this.logger.debug(`keyword successfully created`);

        return newKeyword;
    }

    async deleteKeyword(
        keywordId: Keywords['id']
    ): Promise<number> {
        this.logger.log(`Trying to delete keyword`);

        const keyword = await this.keywordsRepository.getKeywordById(keywordId);

        if (!keyword) {
            this.logger.error(`keyword with keywordId: ${keywordId} not exist`);
            throw new HttpException(`keyword with keywordId: ${keywordId} not exist`, HttpStatus.BAD_REQUEST);
        }

        const deletedKeyword = await this.keywordsRepository.deleteKeyword(keywordId);

        this.logger.debug(`keyword successfully deleted`);

        return deletedKeyword;
    }

    async updateKeyword(
        keywordId: Keywords['id'],
        updateKeywordsDto: UpdateKeywordsDto
    ): Promise<number> {
        this.logger.log(`Trying to update keyword`);

        const keyword = await this.keywordsRepository.getKeywordById(keywordId);

        if (!keyword) {
            this.logger.error(`keyword with keywordId: ${keywordId} not exist`);
            throw new HttpException(`keyword with keywordId: ${keywordId} not exist`, HttpStatus.BAD_REQUEST);
        }

        const newKeyword = await this.keywordsRepository.updateNewKeyword(keywordId, updateKeywordsDto);

        this.logger.debug(`keyword successfully updated`);

        return newKeyword;
    }

    async resetCountByUserSessionId(userSessionId: UserSession['id']): Promise<number> {
        this.logger.log(`Trying to reset count by userSessionId: ${userSessionId}`);

        const userSession = await this.userSessionRepository.getUserSessionById(userSessionId);

        if (!userSession) {
            this.logger.error(`session with userSessionId: ${userSessionId} not exist`);
            throw new HttpException(`session with userSessionId: ${userSessionId} not exist`, HttpStatus.BAD_REQUEST);
        }

        const resetKeywords = this.keywordsRepository.resetCountByUserSessionId(userSessionId);

        this.logger.debug(`count successfully reset`);

        return resetKeywords;
    }

    async increaseKeywordCountById(id: Keywords['id']): Promise<number> {
        this.logger.log(`Trying to increase count by id: ${id}`);

        const keyword = await this.keywordsRepository.getKeywordsByUserSessionId(id);

        if (!keyword) {
            this.logger.error(`keyword with id: ${id} not exist`);
            throw new HttpException(`keyword with id: ${id} not exist`, HttpStatus.BAD_REQUEST);
        }

        const resetKeywords = this.keywordsRepository.increaseKeywordCountById(id);

        this.logger.debug(`count successfully increased`);

        return resetKeywords;
    }

    async getKeywordsByUserSessionId(userSessionId: UserSession['id']): Promise<Keywords[]> {
        this.logger.log(`Trying to get keywords by id: ${userSessionId}`);

        const userSession = await this.userSessionRepository.getUserSessionById(userSessionId);

        if (!userSession) {
            this.logger.error(`keywords with id: ${userSessionId} not found`);
            throw new HttpException(`keywords with id: ${userSessionId} not found`, HttpStatus.NOT_FOUND);
        }

        const keywords = await this.keywordsRepository.getKeywordsByUserSessionId(userSessionId);

        this.logger.debug(`keywords successfully get`);

        return keywords;
    }

    async getKeywordsByMessage(message: string, userSessionId: UserSession['id']): Promise<Keywords> {
        this.logger.log(`Trying to get keywords by userSessionId: ${userSessionId} and message: ${message} `);

        const userSession = await this.userSessionRepository.getUserSessionById(userSessionId);

        if (!userSession) {
            this.logger.error(`keywords with id: ${userSessionId} not found`);
            throw new HttpException(`keywords with id: ${userSessionId} not found`, HttpStatus.NOT_FOUND);
        }

        const keywords = await this.keywordsRepository.getKeywordsByMessage(message, userSessionId);

        this.logger.debug(`keywords successfully get`);

        return keywords;
    }
}
