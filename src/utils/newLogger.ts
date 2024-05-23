import { app } from 'src/main';
import { UserSessionService } from 'src/userSession/userSession.service';
import { Logger } from 'telegram';

export default class NewLogger extends Logger {
  async info(message: string) {
    console.log(`\x1b[33m Info: ${message} \x1b[0m`);

    if (message === 'The server closed the connection while sending' || message === 'connection closed') {
      const appInstance = await app;
      const userSessionService = appInstance.get(UserSessionService);
      userSessionService.reconnectAllUserSessions();
    }
  }
}
