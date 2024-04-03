import {Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {JwtGuard} from "../auth/jwtAuth.guard";
import {KeywordsService} from "./keywords.service";
import {Keyword} from "./entity/keywords.entity";
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
    ) {
        await this.keywordsService.createNewKeyword(telegramId, createKeywordsDto);
        throw new HttpException('Ключевое слово успешно создано', HttpStatus.CREATED);
    }

    @Patch(':id')
    @UseGuards(JwtGuard)
    async editKeywordsByTelegramId(
        @Param('id') keywordId: Keyword['id'],
        @Body() updateKeywordsDto: UpdateKeywordsDto,
    ) {
        await this.keywordsService.updateKeyword(keywordId, updateKeywordsDto);
        throw new HttpException('Ключевое слово успешно изменено', HttpStatus.OK);
    }

    @Delete(':id')
    @UseGuards(JwtGuard)
    async deleteKeywordsByTelegramId(
        @Param('id') keywordId: Keyword['id']
    ){
        await this.keywordsService.deleteKeyword(keywordId);
        throw new HttpException('Ключевое слово успешно удалено', HttpStatus.OK);
    }

    @Get(':id')
    @UseGuards(JwtGuard)
    async getKeywordsByUserSessionId( @Param('id') userSessionId: UserSession['id']): Promise<Keyword[]> {
        return this.keywordsService.getKeywordsByUserSessionId(userSessionId);
    }
}
