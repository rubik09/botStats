import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';

import { ICreateClient } from './interfaces';
import NewLogger from './newLogger';

export const createClient = async ({ logSession, apiId, apiHash }: ICreateClient) => {
  try {
    const stringSession = new StringSession(logSession);
    const client = new TelegramClient(stringSession, Number(apiId), apiHash, {
      connectionRetries: 5,
      sequentialUpdates: true,
      baseLogger: new NewLogger(),
    });

    const isConnect = await client.connect();
    client.floodSleepThreshold = 300;

    if (!isConnect) {
      throw new Error(`client not connected with apiId: ${apiId} and apiHash: ${apiHash}`);
    }

    return client;
  } catch (e) {
    console.log(e.message);
  }
};
