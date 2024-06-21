import { TelegramClient } from 'telegram';

import { createClient } from './createClient';
import emitterSubject from './emitter';
import { UserSession } from '../userSession/entity/userSession.entity';

const clientsTelegram: Record<string, TelegramClient> = {};

async function telegramInit({ logSession, apiId, apiHash, telegramId }: UserSession) {
  const client = await createClient({ logSession, apiId, apiHash });

  const isAuthorization = await client.checkAuthorization();

  if (!isAuthorization) {
    throw new Error(`User not authorized with telegramId: ${telegramId}`);
  }

  clientsTelegram[telegramId] = client;

  emitterSubject.next({ eventName: 'newClient', data: client });
}

async function telegramAccountsInit(allSessions: UserSession[]): Promise<PromiseSettledResult<void>[]> {
  const results = await Promise.allSettled(
    allSessions.filter((session) => session.status).map((session) => telegramInit(session)),
  );

  return results;
}

export default telegramAccountsInit;
