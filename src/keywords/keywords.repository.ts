import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';

import { CreateKeywordsDto } from './dto/createKeywords.dto';
import { UpdateKeywordsDto } from './dto/updateKeywords.dto';
import { Keyword } from './entity/keywords.entity';
import { CounterMetricsConfig, HistogramMetricsConfig, KeywordMethodNames, Status } from '../metrics/metrics.constant';

@Injectable()
export class KeywordsRepository {
  constructor(
    @InjectMetric(CounterMetricsConfig.DB_REQUEST_KEYWORDS_TOTAL.name) private readonly dbRequestTotal: Counter<string>,
    @InjectMetric(HistogramMetricsConfig.DB_REQUEST_KEYWORDS_DURATION.name)
    private readonly dbRequestDuration: Histogram<string>,
    @InjectRepository(Keyword)
    private readonly keywordsRepository: Repository<Keyword>,
  ) {}

  async createNewKeyword(createKeywordsDto: CreateKeywordsDto): Promise<InsertResult> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: KeywordMethodNames.CREATE_NEW_KEYWORD });
    this.dbRequestTotal.inc({ method: KeywordMethodNames.CREATE_NEW_KEYWORD });

    try {
      const result = await this.keywordsRepository
        .createQueryBuilder('keywords')
        .insert()
        .into(Keyword)
        .values(createKeywordsDto)
        .execute();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }

  async updateNewKeyword(id: number, updateKeywordsDto: UpdateKeywordsDto): Promise<UpdateResult> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: KeywordMethodNames.UPDATE_NEW_KEYWORD });
    this.dbRequestTotal.inc({ method: KeywordMethodNames.UPDATE_NEW_KEYWORD });

    try {
      const result = await this.keywordsRepository
        .createQueryBuilder('keywords')
        .update(Keyword)
        .set(updateKeywordsDto)
        .where('id = :id', { id })
        .execute();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }

  async deleteKeyword(id: number): Promise<DeleteResult> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: KeywordMethodNames.DELETE_KEYWORD });
    this.dbRequestTotal.inc({ method: KeywordMethodNames.DELETE_KEYWORD });

    try {
      const result = await this.keywordsRepository
        .createQueryBuilder('keywords')
        .delete()
        .where('id = :id', { id })
        .execute();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }

  async getKeywordById(id: number): Promise<Keyword> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: KeywordMethodNames.GET_KEYWORD_BY_ID });
    this.dbRequestTotal.inc({ method: KeywordMethodNames.GET_KEYWORD_BY_ID });

    try {
      const result = await this.keywordsRepository
        .createQueryBuilder('keywords')
        .leftJoinAndSelect('keywords.userSession', 'userSession')
        .where('keywords.id = :id', { id })
        .getOne();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }

  async resetCountByUserSessionId(id: number): Promise<UpdateResult> {
    const timerRequest = this.dbRequestDuration.startTimer({
      method: KeywordMethodNames.RESET_COUNT_BY_USER_SESSION_ID,
    });
    this.dbRequestTotal.inc({ method: KeywordMethodNames.RESET_COUNT_BY_USER_SESSION_ID });

    try {
      const result = await this.keywordsRepository
        .createQueryBuilder('keywords')
        .update(Keyword)
        .set({ count: 0 })
        .where('userSession.id = :id', { id })
        .execute();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }

  async increaseKeywordCountById(id: number): Promise<UpdateResult> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: KeywordMethodNames.INCREASE_KEYWORD_COUNT_BY_ID });
    this.dbRequestTotal.inc({ method: KeywordMethodNames.INCREASE_KEYWORD_COUNT_BY_ID });

    try {
      const result = await this.keywordsRepository
        .createQueryBuilder('keywords')
        .update(Keyword)
        .set({ count: () => 'count + 1' })
        .where('id = :id', { id })
        .execute();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }

  async getKeywordsByUserSessionId(userSessionId: number): Promise<[Keyword[], number]> {
    const timerRequest = this.dbRequestDuration.startTimer({
      method: KeywordMethodNames.GET_KEYWORDS_BY_USER_SESSION_ID,
    });
    this.dbRequestTotal.inc({ method: KeywordMethodNames.GET_KEYWORDS_BY_USER_SESSION_ID });

    try {
      const result = await this.keywordsRepository
        .createQueryBuilder('keywords')
        .where('keywords.user_session_id = :userSessionId', { userSessionId })
        .getManyAndCount();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }

  async findKeywordByUserSessionIdAndMessage(message: string, userSessionId: number): Promise<Keyword> {
    const timerRequest = this.dbRequestDuration.startTimer({
      method: KeywordMethodNames.FIND_KEYWORD_BY_USER_SESSION_ID_AND_MESSAGE,
    });
    this.dbRequestTotal.inc({ method: KeywordMethodNames.FIND_KEYWORD_BY_USER_SESSION_ID_AND_MESSAGE });

    try {
      const result = await this.keywordsRepository
        .createQueryBuilder('keywords')
        .where('keywords.user_session_id = :userSessionId', { userSessionId })
        .andWhere(":message ILike CONCAT('%', TRIM(BOTH '\"' FROM keywords.keyword::text), '%')", { message })
        .getOne();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }

  async findKeywordByUserSession(userSessionId: number, keyword: string): Promise<Keyword> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: KeywordMethodNames.FIND_KEYWORD_BY_USER_SESSION });
    this.dbRequestTotal.inc({ method: KeywordMethodNames.FIND_KEYWORD_BY_USER_SESSION });

    try {
      const result = await this.keywordsRepository
        .createQueryBuilder('keywords')
        .where('keywords.user_session_id = :userSessionId', { userSessionId })
        .andWhere('keywords.keyword = :keyword', { keyword: `"${keyword}"` })
        .getOne();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }
}
