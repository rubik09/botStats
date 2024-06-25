import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';

import { createCLientConfig } from './consts';
import { ICreateClient } from './interfaces';
import NewLogger from './newLogger';

export const createClient = async ({ logSession, apiId, apiHash }: ICreateClient) => {
  try {
    const stringSession = new StringSession(logSession);
    const client = new TelegramClient(stringSession, Number(apiId), apiHash, {
      connectionRetries: createCLientConfig.CONNECTION_RETRIES,
      sequentialUpdates: createCLientConfig.SEQUENTIAL_UPDATES,
      floodSleepThreshold: createCLientConfig.FLOOD_SLEEP_THRESHOLD,
      baseLogger: new NewLogger(),
    });

    const isConnect = await client.connect();

    if (!isConnect) {
      throw new Error(`client not connected with apiId: ${apiId} and apiHash: ${apiHash}`);
    }

    return client;
  } catch (e) {}
};
