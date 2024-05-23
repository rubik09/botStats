import { Body, Controller, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';

import { CreateTelegramConnectionDto } from './dto/createTelegramConnect.dto';
import { TelegramConnectService } from './telegramConnect.service';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('telegramConnect')
export class TelegramConnectController {
  constructor(private readonly telegramConnectService: TelegramConnectService) {}

  @Post()
  async connectToTelegram(@Body() createTelegramConnectionDto: CreateTelegramConnectionDto) {
    await this.telegramConnectService.connectToTelegram(createTelegramConnectionDto);
    throw new HttpException('Шаг успешно завершён', HttpStatus.OK);
  }
}
