import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import { CreateKeywordsDto } from './dto/createKeywords.dto';
import { UpdateKeywordsDto } from './dto/updateKeywords.dto';
import { Keyword } from './entity/keywords.entity';
import { KeywordsRepository } from './keywords.repository';
import { UserSession } from '../userSession/entity/userSession.entity';
import { UserSessionRepository } from '../userSession/userSession.repository';

@Injectable()
export class KeywordsService {
  private readonly logger = new Logger(KeywordsService.name);
  constructor(
    private userSessionRepository: UserSessionRepository,
    private keywordsRepository: KeywordsRepository,
  ) {}

  async createNewKeyword(telegramId: UserSession['telegramId'], createKeywordsDto: CreateKeywordsDto) {
    this.logger.log(`Trying to create keyword by id: ${telegramId}`);

    const userSession = await this.userSessionRepository.getUserSessionByTelegramId(telegramId);

    if (!userSession) {
      this.logger.error(`session with telegramId: ${telegramId} not exist`);
      throw new HttpException(`session with telegramId: ${telegramId} not exist`, HttpStatus.BAD_REQUEST);
    }

    const keywordDto: CreateKeywordsDto = {
      ...createKeywordsDto,
      userSession,
    };

    const { raw } = await this.keywordsRepository.createNewKeyword(keywordDto);

    this.logger.debug(`keyword successfully created with id: ${raw[0].id}`);
  }

  async deleteKeyword(id: Keyword['id']) {
    this.logger.log(`Trying to delete keyword by id: ${id}`);

    const keyword = await this.keywordsRepository.getKeywordById(id);

    if (!keyword) {
      this.logger.error(`keyword with keywordId: ${id} not exist`);
      throw new HttpException(`keyword with keywordId: ${id} not exist`, HttpStatus.BAD_REQUEST);
    }

    await this.keywordsRepository.deleteKeyword(id);

    this.logger.debug(`keyword successfully deleted by id: ${id}`);
  }

  async updateKeyword(id: Keyword['id'], updateKeywordsDto: UpdateKeywordsDto) {
    this.logger.log(`Trying to update keyword by id: ${id}`);

    const keyword = await this.keywordsRepository.getKeywordById(id);

    if (!keyword) {
      this.logger.error(`keyword with keywordId: ${id} not exist`);
      throw new HttpException(`keyword with keywordId: ${id} not exist`, HttpStatus.BAD_REQUEST);
    }

    await this.keywordsRepository.updateNewKeyword(id, updateKeywordsDto);

    this.logger.debug(`keyword successfully updated by id: ${id}`);
  }

  async resetCountByUserSessionId(id: UserSession['id']) {
    this.logger.log(`Trying to reset count by userSessionId: ${id}`);

    const userSession = await this.userSessionRepository.getUserSessionById(id);

    if (!userSession) {
      this.logger.error(`session with userSessionId: ${id} not exist`);
      throw new HttpException(`session with userSessionId: ${id} not exist`, HttpStatus.BAD_REQUEST);
    }

    await this.keywordsRepository.resetCountByUserSessionId(id);

    this.logger.debug(`count successfully reset by id: ${id}`);
  }

  async increaseKeywordsCountByIdArr(keywordIdArr: Keyword['id'][]) {
    this.logger.log(`Trying to increase count by ids: ${keywordIdArr}`);

    await this.keywordsRepository.increaseKeywordCountByIdArr(keywordIdArr);

    this.logger.debug(`count successfully increased by ids: ${keywordIdArr}`);
  }

  async getKeywordsByUserSessionId(id: UserSession['id']): Promise<Keyword[]> {
    this.logger.log(`Trying to get keywords by id: ${id}`);

    const userSession = await this.userSessionRepository.getUserSessionById(id);

    if (!userSession) {
      this.logger.error(`keywords with id: ${id} not found`);
      throw new HttpException(`keywords with id: ${id} not found`, HttpStatus.NOT_FOUND);
    }

    const [keywords] = await this.keywordsRepository.getKeywordsByUserSessionId(id);

    this.logger.debug(`keywords successfully get by id: ${id}`);

    return keywords;
  }

  async getKeywordsIdArrByKeywordMessage(message: string, apiId: UserSession['apiId']): Promise<number[]> {
    this.logger.log(`Trying to get keywords by apiId: ${apiId} and message: ${message} `);

    const userSession = await this.userSessionRepository.getUserSessionByApiId(apiId);

    if (!userSession) {
      this.logger.error(`keywords with apiId: ${apiId} not found`);
      throw new HttpException(`keywords with apiId: ${apiId} not found`, HttpStatus.NOT_FOUND);
    }

    const keywordsId = await this.keywordsRepository.getKeywordsIdArrByKeywordMessage(message, apiId);

    this.logger.debug(`keywords successfully get by apiId: ${apiId}`);

    return keywordsId.map((result) => result.id);
  }
}
