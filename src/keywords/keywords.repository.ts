import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';

import { CreateKeywordsDto } from './dto/createKeywords.dto';
import { UpdateKeywordsDto } from './dto/updateKeywords.dto';
import { Keyword } from './entity/keywords.entity';

@Injectable()
export class KeywordsRepository {
  constructor(
    @InjectRepository(Keyword)
    private readonly keywordsRepository: Repository<Keyword>,
  ) {}

  async createNewKeyword(createKeywordsDto: CreateKeywordsDto): Promise<InsertResult> {
    return await this.keywordsRepository
      .createQueryBuilder('keywords')
      .insert()
      .into(Keyword)
      .values(createKeywordsDto)
      .execute();
  }

  async updateNewKeyword(id: number, updateKeywordsDto: UpdateKeywordsDto): Promise<UpdateResult> {
    return await this.keywordsRepository
      .createQueryBuilder('keywords')
      .update(Keyword)
      .set(updateKeywordsDto)
      .where('id = :id', { id })
      .execute();
  }

  async deleteKeyword(id: number): Promise<DeleteResult> {
    return await this.keywordsRepository.createQueryBuilder('keywords').delete().where('id = :id', { id }).execute();
  }

  async getKeywordById(id: number): Promise<Keyword> {
    return await this.keywordsRepository
      .createQueryBuilder('keywords')
      .loadAllRelationIds()
      .where('keywords.id = :id', { id })
      .getOne();
  }

  async resetCountByUserSessionId(id: number): Promise<UpdateResult> {
    return await this.keywordsRepository
      .createQueryBuilder('keywords')
      .update(Keyword)
      .set({ count: 0 })
      .where('userSession.id = :id', { id })
      .execute();
  }

  async increaseKeywordCountById(id: number): Promise<UpdateResult> {
    return await this.keywordsRepository
      .createQueryBuilder('keywords')
      .update(Keyword)
      .set({ count: () => 'count + 1' })
      .where('id = :id', { id })
      .execute();
  }

  async getKeywordsByUserSessionId(userSessionId: number): Promise<[Keyword[], number]> {
    return await this.keywordsRepository
      .createQueryBuilder('keywords')
      .where('keywords.user_session_id = :userSessionId', { userSessionId })
      .getManyAndCount();
  }

  async findKeywordByUserSessionIdAndMessage(message: string, userSessionId: number): Promise<Keyword> {
    return await this.keywordsRepository
      .createQueryBuilder('keywords')
      .where('keywords.user_session_id = :userSessionId', { userSessionId })
      .andWhere(":message ILike CONCAT('%', TRIM(BOTH '\"' FROM keywords.keyword::text), '%')", { message })
      .getOne();
  }

  async findKeywordByUserSession(userSessionId: number, keyword: string): Promise<Keyword> {
    return await this.keywordsRepository
      .createQueryBuilder('keywords')
      .where('keywords.user_session_id = :userSessionId', { userSessionId })
      .andWhere('keywords.keyword = :keyword', { keyword: `"${keyword}"` })
      .getOne();
  }
}
