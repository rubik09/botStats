import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {JwtGuard} from "../auth/jwtAuth.guard";
import {KeywordsService} from "./keywords.service";
import {Keywords} from "./entity/keywords.entity";
import {CreateKeywordsDto} from "./dto/createKeywords.dto";
import {UserSession} from "../userSession/entity/userSession.entity";
import {UpdateKeywordsDto} from "./dto/updateKeywords.dto";

@Controller('keywords')
export class KeywordsController {
    constructor(private readonly keywordsService: KeywordsService) {}

    @Post(':id')
    @UseGuards(JwtGuard)
    async addKeywordsByTelegramId(
        @Param('id') telegramId: UserSession['telegramId'],
        @Body() createKeywordsDto: CreateKeywordsDto,
    ): Promise<Keywords> {
        return this.keywordsService.createNewKeyword(telegramId, createKeywordsDto);
    }

    @Patch(':id')
    @UseGuards(JwtGuard)
    async editKeywordsByTelegramId(
        @Param('id') keywordId: Keywords['id'],
        @Body() updateKeywordsDto: UpdateKeywordsDto,
    ): Promise<number> {
        return this.keywordsService.updateKeyword(keywordId, updateKeywordsDto);
    }

    @Delete(':id')
    @UseGuards(JwtGuard)
    async deleteKeywordsByTelegramId(
        @Param('id') keywordId: Keywords['id']
    ): Promise<number> {
        return this.keywordsService.deleteKeyword(keywordId);
    }

    @Get(':id')
    @UseGuards(JwtGuard)
    async getKeywordsByUserSessionId( @Param('id') userSessionId: UserSession['id']): Promise<Keywords[]> {
        return this.keywordsService.getKeywordsByUserSessionId(userSessionId);
    }
}
