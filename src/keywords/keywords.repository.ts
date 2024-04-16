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
    return await this.keywordsRepository.createQueryBuilder('keywords').where('id = :id', { id }).getOne();
  }

  async getKeywordsByUserSessionId(id: number): Promise<[Keyword[], number]> {
    return await this.keywordsRepository
      .createQueryBuilder('keywords')
      .leftJoinAndSelect('keywords.userSession', 'userSession')
      .where('userSession.id = :id', { id })
      .getManyAndCount();
  }

  async resetCountByUserSessionId(id: number): Promise<UpdateResult> {
    return await this.keywordsRepository
      .createQueryBuilder('keywords')
      .update(Keyword)
      .set({ count: 0 })
      .where('userSession.id = :id', { id })
      .execute();
  }

  async increaseKeywordCountByIdsArr(keywordIdArr: number[]): Promise<UpdateResult> {
    return await this.keywordsRepository
      .createQueryBuilder('keywords')
      .update(Keyword)
      .set({ count: () => 'count + 1' })
      .whereInIds(keywordIdArr)
      .execute();
  }

  async getKeywordsIdArrByKeywordMessage(message: string, apiId: number): Promise<Keyword[]> {
    return await this.keywordsRepository
      .createQueryBuilder('keywords')
      .leftJoin('keywords.userSession', 'userSession')
      .where('keywords.keyword = :message', { message: JSON.stringify(message) })
      .select(['keywords.id'])
      .andWhere('userSession.api_id = :apiId', { apiId })
      .getMany();
  }
}
