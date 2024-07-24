import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Histogram } from 'prom-client';

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
    @InjectMetric('db_request_keywords_duration_seconds') private dbRequestDuration: Histogram<string>,

    private userSessionService: UserSessionService,
    private keywordsRepository: KeywordsRepository,
  ) {}

  async createNewKeyword(id: UserSession['id'], { keyword, activity }: CreateKeywordsDto) {
    this.logger.log(`Trying to create keyword by id: ${id}`);

    const timerRequest = this.dbRequestDuration.startTimer({ method: 'createNewKeyword' });

    try {
      const userSession = await this.userSessionService.getUserSessionById(id);
      const existingKeyword = await this.keywordsRepository.findKeywordByUserSession(id, keyword);

      if (existingKeyword) {
        this.logger.error(`keyword: ${keyword} already exist`);
        throw new HttpException(`keyword: ${keyword} already exist`, HttpStatus.CONFLICT);
      }

      const createKeywordsDto: CreateKeywordsDto = {
        keyword: keyword.trim(),
        activity,
        userSession,
      };

      const { raw } = await this.keywordsRepository.createNewKeyword(createKeywordsDto);

      this.logger.debug(`keyword successfully created with id: ${raw[0].id}`);
    } finally {
      timerRequest();
    }
  }

  async deleteKeyword(id: Keyword['id']) {
    this.logger.log(`Trying to delete keyword by id: ${id}`);

    const timerRequest = this.dbRequestDuration.startTimer({ method: 'deleteKeyword' });

    try {
      const keywordById = await this.keywordsRepository.getKeywordById(id);

      if (!keywordById) {
        this.logger.error(`keyword with keywordId: ${id} not exist`);
        throw new HttpException(`keyword with keywordId: ${id} not exist`, HttpStatus.BAD_REQUEST);
      }

      const { affected } = await this.keywordsRepository.deleteKeyword(id);

      this.logger.debug(`${affected} keyword successfully deleted by id: ${id}`);
    } finally {
      timerRequest();
    }
  }

  async updateKeyword(id: Keyword['id'], { keyword, activity }: UpdateKeywordsDto) {
    this.logger.log(`Trying to update keyword by id: ${id}`);

    const timerRequest = this.dbRequestDuration.startTimer({ method: 'updateKeyword' });

    try {
      const keywordById = await this.keywordsRepository.getKeywordById(id);

      if (!keywordById) {
        this.logger.error(`keyword with keywordId: ${id} not exist`);
        throw new HttpException(`keyword with keywordId: ${id} not exist`, HttpStatus.BAD_REQUEST);
      }

      const existingKeyword = await this.keywordsRepository.findKeywordByUserSession(
        keywordById.userSession.id,
        keyword,
      );

      if (existingKeyword) {
        const { activity: existingKeywordActivity } = existingKeyword;
        const isDuplicateActivity = existingKeywordActivity === activity;

        if (isDuplicateActivity) {
          this.logger.error(`keyword: ${keyword} with ${activity} already exist`);
          throw new HttpException(`keyword: ${keyword} with ${activity} already exist`, HttpStatus.CONFLICT);
        }
      }

      const { affected } = await this.keywordsRepository.updateNewKeyword(id, { keyword: keyword.trim(), activity });

      this.logger.debug(`${affected} keyword successfully updated by id: ${id}`);
    } finally {
      timerRequest();
    }
  }

  async resetCountByUserSessionId(id: UserSession['id']) {
    this.logger.log(`Trying to reset count by userSessionId: ${id}`);
    const timerRequest = this.dbRequestDuration.startTimer({ method: 'resetCountByUserSessionId' });

    try {
      await this.userSessionService.getUserSessionById(id);

      const { affected } = await this.keywordsRepository.resetCountByUserSessionId(id);

      this.logger.debug(`${affected} count successfully reset by id: ${id}`);
    } finally {
      timerRequest();
    }
  }

  async increaseKeywordsCountById(id: Keyword['id']) {
    this.logger.log(`Trying to increase count by id: ${id}`);

    const timerRequest = this.dbRequestDuration.startTimer({ method: 'increaseKeywordsCountById' });

    try {
      const { affected } = await this.keywordsRepository.increaseKeywordCountById(id);

      this.logger.debug(`${affected} count successfully increased by id: ${id}`);
    } finally {
      timerRequest();
    }
  }

  async getKeywordsByUserSessionId(id: UserSession['id']): Promise<Keyword[]> {
    this.logger.log(`Trying to get keywords by UserSessionId: ${id}`);

    const timerRequest = this.dbRequestDuration.startTimer({ method: 'getKeywordsByUserSessionId' });

    try {
      const [keywords, count] = await this.keywordsRepository.getKeywordsByUserSessionId(id);

      this.logger.debug(`${count} keywords successfully get by UserSessionId: ${id}`);

      return keywords;
    } finally {
      timerRequest();
    }
  }

  async findKeywordByUserSessionIdAndMessage(message: string, id: UserSession['id']): Promise<Keyword> {
    this.logger.log(`Trying to find keyword by UserSessionId: ${id}`);

    const timerRequest = this.dbRequestDuration.startTimer({ method: 'findKeywordByUserSessionIdAndMessage' });

    try {
      const foundKeyword = await this.keywordsRepository.findKeywordByUserSessionIdAndMessage(message.trim(), id);

      this.logger.debug(`${foundKeyword ? 'keyword ' : 'No keyword '}found by UserSessionId: ${id}`);

      return foundKeyword;
    } finally {
      timerRequest();
    }
  }
}
