import { Injectable } from '@nestjs/common';

import { BotAlertProvider } from './botAlert.provider';

@Injectable()
export class BotAlertService {
  constructor(private readonly bot: BotAlertProvider) {}

  async sendMessage(chatId: number, message: string) {
    await this.bot.sendMessage(chatId, message);
  }
}
