import { Logger } from 'telegram';

import botAlert from './botAlert';
import { MESSAGES_CONNECTION_CLOSED } from './consts';
import config from '../configuration/config';
import { app } from '../main';
import { UserSessionService } from '../userSession/userSession.service';

const { CHAT_ID_ALERT } = config();

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
