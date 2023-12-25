import { Injectable, Logger, LoggerService } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';

import { BotService } from '../bot/bot.service';

@Injectable()
export class UpdatesService {
  private readonly logger: LoggerService = new Logger(UpdatesService.name);

  constructor(private readonly botService: BotService) {}

  handleUpdate(update: TelegramBot.Update) {
    this.logger.debug(`Update: ${JSON.stringify(update)}`);
    this.botService.sendMessage(update.message.chat.id, 'Вас понял, прием');
    return ``;
  }
}
