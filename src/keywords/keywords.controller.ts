import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CreateKeywordsDto } from './dto/createKeywords.dto';
import { UpdateKeywordsDto } from './dto/updateKeywords.dto';
import { Keyword } from './entity/keywords.entity';
import { KeywordsService } from './keywords.service';
import { JwtGuard } from '../auth/jwtAuth.guard';
import { UserSession } from '../userSession/entity/userSession.entity';

@Controller('keywords')
export class KeywordsController {
  constructor(private readonly keywordsService: KeywordsService) {}

  @Post(':id')
  @UseGuards(JwtGuard)
  async addKeywordsByTelegramId(
    @Param('id') id: UserSession['telegramId'],
    @Body() createKeywordsDto: CreateKeywordsDto,
  ) {
    await this.keywordsService.createNewKeyword(id, createKeywordsDto);
    throw new HttpException('Ключевое слово успешно создано', HttpStatus.CREATED);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  async editKeywordsByTelegramId(@Param('id') id: Keyword['id'], @Body() updateKeywordsDto: UpdateKeywordsDto) {
    await this.keywordsService.updateKeyword(id, updateKeywordsDto);
    throw new HttpException('Ключевое слово успешно изменено', HttpStatus.OK);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deleteKeywordsByTelegramId(@Param('id') id: Keyword['id']) {
    await this.keywordsService.deleteKeyword(id);
    throw new HttpException('Ключевое слово успешно удалено', HttpStatus.OK);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async getKeywordsByUserSessionId(@Param('id') id: UserSession['id']): Promise<Keyword[]> {
    return this.keywordsService.getKeywordsByUserSessionId(id);
  }
}
