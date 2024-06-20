import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BotAlertProvider {
  private readonly botToken: string;
  private readonly telegramBotApiUrl = 'https://api.telegram.org/bot';

  constructor(
    private configService: ConfigService,
    private readonly httpClient: HttpService,
  ) {
    this.botToken = this.configService.get('BOT_TOKEN_ALERT');
  }

  async sendMessage(chatId: number, message: string) {
    const data = {
      chat_id: chatId,
      text: message,
    };

    await firstValueFrom(this.httpClient.post(`${this.telegramBotApiUrl}${this.botToken}/sendMessage`, data));
  }
}
