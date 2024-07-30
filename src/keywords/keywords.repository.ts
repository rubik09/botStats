import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';

import { CreateKeywordsDto } from './dto/createKeywords.dto';
import { UpdateKeywordsDto } from './dto/updateKeywords.dto';
import { Keyword } from './entity/keywords.entity';
import { MetricNames } from '../metrics/metrics.constant';

@Injectable()
export class KeywordsRepository {
  constructor(
    @InjectMetric(MetricNames.DB_REQUEST_KEYWORDS_TOTAL) private dbRequestTotal: Counter<string>,
    @InjectRepository(Keyword)
    private readonly keywordsRepository: Repository<Keyword>,
  ) {}

  async createNewKeyword(createKeywordsDto: CreateKeywordsDto): Promise<InsertResult> {
    this.dbRequestTotal.inc({ method: 'createNewKeyword' });
    return await this.keywordsRepository
      .createQueryBuilder('keywords')
      .insert()
      .into(Keyword)
      .values(createKeywordsDto)
      .execute();
  }

  async updateNewKeyword(id: number, updateKeywordsDto: UpdateKeywordsDto): Promise<UpdateResult> {
    this.dbRequestTotal.inc({ method: 'updateNewKeyword' });
    return await this.keywordsRepository
      .createQueryBuilder('keywords')
      .update(Keyword)
      .set(updateKeywordsDto)
      .where('id = :id', { id })
      .execute();
  }

  async deleteKeyword(id: number): Promise<DeleteResult> {
    this.dbRequestTotal.inc({ method: 'deleteKeyword' });
    return await this.keywordsRepository.createQueryBuilder('keywords').delete().where('id = :id', { id }).execute();
  }

  async getKeywordById(id: number): Promise<Keyword> {
    this.dbRequestTotal.inc({ method: 'getKeywordById' });
    return await this.keywordsRepository
      .createQueryBuilder('keywords')
      .leftJoinAndSelect('keywords.userSession', 'userSession')
      .where('keywords.id = :id', { id })
      .getOne();
  }

  async resetCountByUserSessionId(id: number): Promise<UpdateResult> {
    this.dbRequestTotal.inc({ method: 'resetCountByUserSessionId' });
    return await this.keywordsRepository
      .createQueryBuilder('keywords')
      .update(Keyword)
      .set({ count: 0 })
      .where('userSession.id = :id', { id })
      .execute();
  }

  async increaseKeywordCountById(id: number): Promise<UpdateResult> {
    this.dbRequestTotal.inc({ method: 'increaseKeywordCountById' });
    return await this.keywordsRepository
      .createQueryBuilder('keywords')
      .update(Keyword)
      .set({ count: () => 'count + 1' })
      .where('id = :id', { id })
      .execute();
  }

  async getKeywordsByUserSessionId(userSessionId: number): Promise<[Keyword[], number]> {
    this.dbRequestTotal.inc({ method: 'getKeywordsByUserSessionId' });
    return await this.keywordsRepository
      .createQueryBuilder('keywords')
      .where('keywords.user_session_id = :userSessionId', { userSessionId })
      .getManyAndCount();
  }

  async findKeywordByUserSessionIdAndMessage(message: string, userSessionId: number): Promise<Keyword> {
    this.dbRequestTotal.inc({ method: 'findKeywordByUserSessionIdAndMessage' });
    return await this.keywordsRepository
      .createQueryBuilder('keywords')
      .where('keywords.user_session_id = :userSessionId', { userSessionId })
      .andWhere(":message ILike CONCAT('%', TRIM(BOTH '\"' FROM keywords.keyword::text), '%')", { message })
      .getOne();
  }

  async findKeywordByUserSession(userSessionId: number, keyword: string): Promise<Keyword> {
    this.dbRequestTotal.inc({ method: 'findKeywordByUserSession' });
    return await this.keywordsRepository
      .createQueryBuilder('keywords')
      .where('keywords.user_session_id = :userSessionId', { userSessionId })
      .andWhere('keywords.keyword = :keyword', { keyword: `"${keyword}"` })
      .getOne();
  }
}
