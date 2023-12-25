import { Injectable } from '@nestjs/common';

import { BotProvider } from './bot.provider';

@Injectable()
export class BotService {
  constructor(private readonly bot: BotProvider) {}

  async sendMessage(chatId: number, message: string) {
    await this.bot.sendMessage(chatId, message);
  }
}
