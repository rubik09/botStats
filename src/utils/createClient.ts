import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';

import { ICreateClient } from './interfaces';
import NewLogger from './newLogger';

export const createClient = async ({ logSession, apiId, apiHash }: ICreateClient) => {
  const stringSession = new StringSession(logSession);
  const client = new TelegramClient(stringSession, Number(apiId), apiHash, {
    connectionRetries: 5,
    sequentialUpdates: true,
    baseLogger: new NewLogger(),
  });

  await client.connect();
  client.floodSleepThreshold = 300;

  return client;
};
