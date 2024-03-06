import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Keywords} from "./entity/keywords.entity";
import {CreateKeywordsDto} from "./dto/createKeywords.dto";
import {UpdateKeywordsDto} from "./dto/updateKeywords.dto";
import {UserSession} from "../userSession/entity/userSession.entity";

@Injectable()
export class KeywordsRepository {
    constructor(
        @InjectRepository(Keywords)
        private readonly keywordsRepository: Repository<Keywords>,
    ) {}

    async createNewKeyword(
        createKeywordsDto: CreateKeywordsDto,
    ): Promise<Keywords> {
        return await this.keywordsRepository.save(createKeywordsDto);
    }

    async updateNewKeyword(
        keywordId: Keywords['id'],
        updateKeywordsDto: UpdateKeywordsDto,
    ): Promise<number> {
        const {affected} = await this.keywordsRepository.update(keywordId, updateKeywordsDto);
        return affected
    }

    async deleteKeyword(
        keywordId: Keywords['id'],
    ): Promise<number> {
        const {affected} = await this.keywordsRepository.delete(keywordId);
        return affected;
    }

    async getKeywordById(
        keywordId: Keywords['id'],
    ): Promise<Keywords> {
        return await this.keywordsRepository.findOne({where: {id: keywordId}});
    }

    async resetCountByUserSessionId(userSessionId: UserSession['id']): Promise<number> {
        const {affected} =  await this.keywordsRepository.update({ userSession: { id: userSessionId } }, { count: 0 });
        return affected;
    }

    async increaseKeywordCountById(keywordId: Keywords['id']): Promise<number> {
        const { affected } = await this.keywordsRepository.increment({ id: keywordId }, 'count', 1);
        return affected;
    }
}
