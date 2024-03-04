import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { CreateTelegramConnectionDto } from './dto/createTelegramConnect.dto';
import { TelegramConnectService } from './telegramConnect.service';
import { JwtGuard } from '../auth/jwtAuth.guard';

@Controller('telegramConnect')
export class TelegramConnectController {
  constructor(private readonly telegramConnectService: TelegramConnectService) {}

  @Post()
  @UseGuards(JwtGuard)
  async connectToTelegram(@Body() createTelegramConnectionDto: CreateTelegramConnectionDto) {
    await this.telegramConnectService.connectToTelegram(createTelegramConnectionDto);
  }
}
