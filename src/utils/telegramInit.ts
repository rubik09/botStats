import { TelegramClient } from 'telegram';

import { createClient } from './createClient';
import emitterSubject from './emitter';
import { ITelegramInit } from './interfaces';
import { UserSession } from '../userSession/entity/userSession.entity';

const clientsTelegram: Record<string, TelegramClient> = {};

async function telegramInit({ logSession, apiId, apiHash, telegramId }: ITelegramInit) {
  const client = await createClient({ logSession, apiId, apiHash });

  await client.checkAuthorization();
  clientsTelegram[telegramId] = client;

  emitterSubject.next({ eventName: 'newClient', data: client });
}

async function telegramAccountsInit(allSessions: UserSession[]) {
  await Promise.allSettled(
    allSessions
      .filter((session) => session.status)
      .map(({ logSession, apiId, apiHash, telegramId }) => telegramInit({ logSession, apiId, apiHash, telegramId })),
  );
}

export default telegramAccountsInit;
