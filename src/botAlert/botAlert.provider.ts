import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import { TELEGRAM_BOT_API_URL } from '../utils/consts';
import { ITelegramMessage } from '../utils/interfaces';

@Injectable()
export class BotAlertProvider {
  private readonly botToken: string;

  constructor(
    private configService: ConfigService,
    private readonly httpClient: HttpService,
  ) {
    this.botToken = this.configService.get('BOT_TOKEN_ALERT');
  }

  async sendMessage(chatId: number, message: string) {
    const telegramMessage: ITelegramMessage = {
      chat_id: chatId,
      text: message,
    };

    const url = `${TELEGRAM_BOT_API_URL}${this.botToken}/sendMessage`;

    await firstValueFrom(this.httpClient.post(url, telegramMessage));
  }
}
