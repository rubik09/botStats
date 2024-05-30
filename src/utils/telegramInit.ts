import { TelegramClient } from 'telegram';

import { createClient } from './createClient';
import emitterSubject from './emitter';
import { UserSession } from '../userSession/entity/userSession.entity';

const clientsTelegram: Record<string, TelegramClient> = {};

async function telegramInit({ logSession, apiId, apiHash, telegramId }: UserSession) {

  const client = await createClient({ logSession, apiId, apiHash });

  await client.checkAuthorization();
  clientsTelegram[telegramId] = client;

  emitterSubject.next({ eventName: 'newClient', data: client });
}

async function telegramAccountsInit(allSessions: UserSession[]) {
  await Promise.allSettled(allSessions.filter((session) => session.status).map((session) => telegramInit(session)));
}

export default telegramAccountsInit;
