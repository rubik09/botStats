import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import { CreateKeywordsDto } from './dto/createKeywords.dto';
import { UpdateKeywordsDto } from './dto/updateKeywords.dto';
import { Keyword } from './entity/keywords.entity';
import { KeywordsRepository } from './keywords.repository';
import { UserSession } from '../userSession/entity/userSession.entity';
import { UserSessionService } from '../userSession/userSession.service';

@Injectable()
export class KeywordsService {
  private readonly logger = new Logger(KeywordsService.name);
  constructor(
    private userSessionService: UserSessionService,
    private keywordsRepository: KeywordsRepository,
  ) {}

  async createNewKeyword(id: UserSession['id'], createKeywordsDto: CreateKeywordsDto) {
    this.logger.log(`Trying to create keyword by id: ${id}`);

    const userSession = await this.userSessionService.getUserSessionById(id);

    if (!userSession) {
      this.logger.error(`session with id: ${id} not exist`);
      throw new HttpException(`session with id: ${id} not exist`, HttpStatus.BAD_REQUEST);
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

    const userSession = await this.userSessionService.getUserSessionById(id);

    if (!userSession) {
      this.logger.error(`session with userSessionId: ${id} not exist`);
      throw new HttpException(`session with userSessionId: ${id} not exist`, HttpStatus.BAD_REQUEST);
    }

    await this.keywordsRepository.resetCountByUserSessionId(id);

    this.logger.debug(`count successfully reset by id: ${id}`);
  }

  async increaseKeywordsCountById(id: Keyword['id']) {
    this.logger.log(`Trying to increase count by id: ${id}`);

    await this.keywordsRepository.increaseKeywordCountById(id);

    this.logger.debug(`count successfully increased by id: ${id}`);
  }

  async getKeywordsByUserSessionId(id: UserSession['id']): Promise<Keyword[]> {
    this.logger.log(`Trying to get keywords by UserSessionId: ${id}`);

    const [keywords, count] = await this.keywordsRepository.getKeywordsByUserSessionId(id);

    this.logger.debug(`${count} keywords successfully get by UserSessionId: ${id}`);

    return keywords;
  }
}
