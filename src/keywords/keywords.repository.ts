import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, InsertResult, Repository, UpdateResult} from 'typeorm';
import {Keyword} from "./entity/keywords.entity";
import {CreateKeywordsDto} from "./dto/createKeywords.dto";
import {UpdateKeywordsDto} from "./dto/updateKeywords.dto";

@Injectable()
export class KeywordsRepository {
    constructor(
        @InjectRepository(Keyword)
        private readonly keywordsRepository: Repository<Keyword>,
    ) {}

    async createNewKeyword(createKeywordsDto: CreateKeywordsDto): Promise<InsertResult> {
        return await this.keywordsRepository
            .createQueryBuilder()
            .insert()
            .into(Keyword)
            .values(createKeywordsDto)
            .execute();
    }

    async updateNewKeyword(keywordId: number, updateKeywordsDto: UpdateKeywordsDto): Promise<UpdateResult> {
        return await this.keywordsRepository
            .createQueryBuilder()
            .update(Keyword)
            .set(updateKeywordsDto)
            .where("id = :id", { id: keywordId })
            .execute();
    }

    async deleteKeyword(keywordId: number): Promise<DeleteResult> {
        return await this.keywordsRepository
            .createQueryBuilder()
            .delete()
            .where("id = :id", { id: keywordId })
            .execute();
    }

    async getKeywordById(keywordId: number): Promise<Keyword> {
        return await this.keywordsRepository
            .createQueryBuilder()
            .where("id = :id", { id: keywordId })
            .getOne();
    }

    async getKeywordsByUserSessionId(userSessionId: number): Promise<Keyword[]> {
        return await this.keywordsRepository
            .createQueryBuilder('keywords')
            .leftJoinAndSelect("keywords.userSession", "userSession")
            .where("userSession.id = :userSessionId", { userSessionId })
            .getMany();
    }

    async resetCountByUserSessionId(userSessionId: number): Promise<UpdateResult> {
        return await this.keywordsRepository
            .createQueryBuilder()
            .update(Keyword)
            .set({ count: 0 })
            .where("userSession.id = :userSessionId", { userSessionId })
            .execute();
    }

    async increaseKeywordCountById(keywordId: number): Promise<UpdateResult> {
        return await this.keywordsRepository
            .createQueryBuilder('keywords')
            .update(Keyword)
            .set({ count: () => "count + 1" })
            .where("keywords.id = :id", { id: keywordId })
            .execute();
    }

    async getKeywordsByMessage(message: string, userSessionId: number): Promise<Keyword> {
        return await this.keywordsRepository
            .createQueryBuilder('keywords')
            .leftJoinAndSelect("keywords.userSession", "userSession")
            .where("keywords.keyword = :message", { message })
            .andWhere("userSession.id = :userSessionId", { userSessionId })
            .getOne();
    }
}
