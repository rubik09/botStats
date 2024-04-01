import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Keyword} from "./entity/keywords.entity";
import {CreateKeywordsDto} from "./dto/createKeywords.dto";
import {UpdateKeywordsDto} from "./dto/updateKeywords.dto";
import {UserSession} from "../userSession/entity/userSession.entity";

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
        keywordId: Keyword['id'],
        updateKeywordsDto: UpdateKeywordsDto,
    ): Promise<number> {
        const {affected} = await this.keywordsRepository.update(keywordId, updateKeywordsDto);
        return affected
    }

    async deleteKeyword(
        keywordId: Keyword['id'],
    ): Promise<number> {
        const {affected} = await this.keywordsRepository.delete(keywordId);
        return affected;
    }

    async getKeywordById(
        keywordId: Keyword['id'],
    ): Promise<Keyword> {
        return await this.keywordsRepository.findOne({where: {id: keywordId}});
    }

    async getKeywordsByUserSessionId(userSessionId: number): Promise<Keyword[]> {
        return this.keywordsRepository.find({where: {userSession: { id: userSessionId }}});
    }

    async resetCountByUserSessionId(userSessionId: UserSession['id']): Promise<number> {
        const {affected} =  await this.keywordsRepository.update({ userSession: { id: userSessionId } }, { count: 0 });
        return affected;
    }

    async increaseKeywordCountById(keywordId: Keyword['id']): Promise<number> {
        const { affected } = await this.keywordsRepository.increment({ id: keywordId }, 'count', 1);
        return affected;
    }

    async getKeywordsByMessage(message: string, userSessionId: UserSession['id']): Promise<Keyword> {
        return this.keywordsRepository.findOne({
            where: {
                keyword: JSON.stringify(message),
                userSession: {id: userSessionId}
            }
        })
    }
}
