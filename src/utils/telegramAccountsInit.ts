import telegramInit from './telegramInit';
import { UserSession } from '../userSession/entity/userSession.entity';

async function telegramAccountsInit(allSessions: UserSession[]) {
  for (const session of allSessions) {
    const { status } = session;

    if (!status) continue;

    await telegramInit(session);
  }
}
export default telegramAccountsInit;
