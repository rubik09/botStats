import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Histogram } from 'prom-client';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';

import { CreateKeywordsDto } from './dto/createKeywords.dto';
import { UpdateKeywordsDto } from './dto/updateKeywords.dto';
import { Keyword } from './entity/keywords.entity';

@Injectable()
export class KeywordsRepository {
  constructor(
    @InjectMetric('db_request_keywords_duration_seconds') private dbRequestDuration: Histogram<string>,
    @InjectRepository(Keyword)
    private readonly keywordsRepository: Repository<Keyword>,
  ) {}

  async createNewKeyword(createKeywordsDto: CreateKeywordsDto): Promise<InsertResult> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: 'createNewKeyword' });
    try {
      return await this.keywordsRepository
        .createQueryBuilder('keywords')
        .insert()
        .into(Keyword)
        .values(createKeywordsDto)
        .execute();
    } finally {
      timerRequest();
    }
  }

  async updateNewKeyword(id: number, updateKeywordsDto: UpdateKeywordsDto): Promise<UpdateResult> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: 'updateNewKeyword' });
    try {
      return await this.keywordsRepository
        .createQueryBuilder('keywords')
        .update(Keyword)
        .set(updateKeywordsDto)
        .where('id = :id', { id })
        .execute();
    } finally {
      timerRequest();
    }
  }

  async deleteKeyword(id: number): Promise<DeleteResult> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: 'deleteKeyword' });
    try {
      return await this.keywordsRepository.createQueryBuilder('keywords').delete().where('id = :id', { id }).execute();
    } finally {
      timerRequest();
    }
  }

  async getKeywordById(id: number): Promise<Keyword> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: 'getKeywordById' });
    try {
      return await this.keywordsRepository
        .createQueryBuilder('keywords')
        .leftJoinAndSelect('keywords.userSession', 'userSession')
        .where('keywords.id = :id', { id })
        .getOne();
    } finally {
      timerRequest();
    }
  }

  async resetCountByUserSessionId(id: number): Promise<UpdateResult> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: 'resetCountByUserSessionId' });
    try {
      return await this.keywordsRepository
        .createQueryBuilder('keywords')
        .update(Keyword)
        .set({ count: 0 })
        .where('userSession.id = :id', { id })
        .execute();
    } finally {
      timerRequest();
    }
  }

  async increaseKeywordCountById(id: number): Promise<UpdateResult> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: 'increaseKeywordCountById' });
    try {
      return await this.keywordsRepository
        .createQueryBuilder('keywords')
        .update(Keyword)
        .set({ count: () => 'count + 1' })
        .where('id = :id', { id })
        .execute();
    } finally {
      timerRequest();
    }
  }

  async getKeywordsByUserSessionId(userSessionId: number): Promise<[Keyword[], number]> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: 'getKeywordsByUserSessionId' });
    try {
      return await this.keywordsRepository
        .createQueryBuilder('keywords')
        .where('keywords.user_session_id = :userSessionId', { userSessionId })
        .getManyAndCount();
    } finally {
      timerRequest();
    }
  }

  async findKeywordByUserSessionIdAndMessage(message: string, userSessionId: number): Promise<Keyword> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: 'findKeywordByUserSessionIdAndMessage' });
    try {
      return await this.keywordsRepository
        .createQueryBuilder('keywords')
        .where('keywords.user_session_id = :userSessionId', { userSessionId })
        .andWhere(":message ILike CONCAT('%', TRIM(BOTH '\"' FROM keywords.keyword::text), '%')", { message })
        .getOne();
    } finally {
      timerRequest();
    }
  }

  async findKeywordByUserSession(userSessionId: number, keyword: string): Promise<Keyword> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: 'findKeywordByUserSession' });
    try {
      return await this.keywordsRepository
        .createQueryBuilder('keywords')
        .where('keywords.user_session_id = :userSessionId', { userSessionId })
        .andWhere('keywords.keyword = :keyword', { keyword: `"${keyword}"` })
        .getOne();
    } finally {
      timerRequest();
    }
  }
}
