import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository, UpdateResult} from 'typeorm';
import {Keyword} from "./entity/keywords.entity";
import {CreateKeywordsDto} from "./dto/createKeywords.dto";
import {UpdateKeywordsDto} from "./dto/updateKeywords.dto";

@Injectable()
export class KeywordsRepository {
    constructor(
        @InjectRepository(Keyword)
        private readonly keywordsRepository: Repository<Keyword>,
    ) {}

    async createNewKeyword(
        createKeywordsDto: CreateKeywordsDto,
    ): Promise<Keyword> {
        return await this.keywordsRepository.save(createKeywordsDto);
    }

    async updateNewKeyword(
        keywordId: number,
        updateKeywordsDto: UpdateKeywordsDto,
    ): Promise<UpdateResult> {
        return await this.keywordsRepository.update(keywordId, updateKeywordsDto);
    }

    async deleteKeyword(
        keywordId: number,
    ): Promise<DeleteResult> {
        return await this.keywordsRepository.delete(keywordId);
    }

    async getKeywordById(
        keywordId: number,
    ): Promise<Keyword> {
        return await this.keywordsRepository.findOne({where: {id: keywordId}});
    }

    async getKeywordsByUserSessionId(userSessionId: number): Promise<Keyword[]> {
        return this.keywordsRepository.find({where: {userSession: { id: userSessionId }}});
    }

    async resetCountByUserSessionId(userSessionId: number): Promise<UpdateResult> {
        return await this.keywordsRepository.update({ userSession: { id: userSessionId } }, { count: 0 });
    }

    async increaseKeywordCountById(keywordId: number): Promise<UpdateResult> {
        return await this.keywordsRepository.increment({ id: keywordId }, 'count', 1);
    }

    async getKeywordsByMessage(message: string, userSessionId: number): Promise<Keyword> {
        return this.keywordsRepository.findOne({
            where: {
                keyword: JSON.stringify(message),
                userSession: {id: userSessionId}
            }
        })
    }
}
