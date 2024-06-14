import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';

import { createClientConfig } from './consts';
import { ICreateClient } from './interfaces';
import NewLogger from './newLogger';

export const createClient = async ({ logSession, apiId, apiHash }: ICreateClient) => {
  const stringSession = new StringSession(logSession);
  const client = new TelegramClient(stringSession, Number(apiId), apiHash, {
    connectionRetries: 5,
    sequentialUpdates: true,
    baseLogger: new NewLogger(),
  });

  const sendMessage = async (message: string) => {
    await client.sendMessage(createClientConfig.logChatId, { message });
  };

  const connectWithRetry = async (attempt = 1) => {
    const isConnect = await client.connect();
    if (!isConnect) {
      attempt < createClientConfig.maxRetries
        ? await connectWithRetry(attempt + 1)
        : await sendMessage(createClientConfig.errorMessage);
    }
  };

  await connectWithRetry();
  client.floodSleepThreshold = 300;

  return client;
};
