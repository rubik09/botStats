import { Logger } from 'telegram';

import { MESSAGES_CONNECTION_CLOSED } from './consts';
import { app } from '../main';
import { UserSessionService } from '../userSession/userSession.service';

import config from '../configuration/config';
import * as TelegramBot from 'node-telegram-bot-api';

const { CHAT_ID_ALERT, BOT_TOKEN_ALERT } = config();

const botAlert = new TelegramBot(BOT_TOKEN_ALERT);

export default class NewLogger extends Logger {
  async info(message: string) {
    console.log(`\x1b[33m Info: ${message} \x1b[0m`);

    const isMessageExist = MESSAGES_CONNECTION_CLOSED.includes(message);

    if (isMessageExist) {
      await botAlert.sendMessage(CHAT_ID_ALERT, message);

      const appInstance = await app;
      const userSessionService = appInstance.get<UserSessionService>(UserSessionService);
      userSessionService.reconnectAllUserSessions();
    }
  }
}
