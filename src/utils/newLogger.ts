import { app } from 'src/main';
import { UserSessionService } from 'src/userSession/userSession.service';
import { Logger } from 'telegram';
import { MESSAGES_CONNECTION_CLOSED } from './consts';

export default class NewLogger extends Logger {
  async info(message: string) {
    console.log(`\x1b[33m Info: ${message} \x1b[0m`);

    const isMessageExist = MESSAGES_CONNECTION_CLOSED.includes(message);

    if (isMessageExist) {
      const appInstance = await app;
      const userSessionService = appInstance.get<UserSessionService>(UserSessionService);
      userSessionService.reconnectAllUserSessions();
    }
  }
}
