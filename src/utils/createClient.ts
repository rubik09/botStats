import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';

import { CREATE_CLIENT_CONFIG } from './consts';
import { ICreateClient } from './interfaces';
import NewLogger from './newLogger';

export const createClient = async ({ logSession, apiId, apiHash }: ICreateClient) => {
  try {
    const stringSession = new StringSession(logSession);
    const client = new TelegramClient(stringSession, apiId, apiHash, {
      ...CREATE_CLIENT_CONFIG,
      baseLogger: new NewLogger(),
    });

    const isConnect = await client.connect();

    if (!isConnect) {
      throw new Error(`client not connected with apiId: ${apiId} and apiHash: ${apiHash}`);
    }

    return client;
  } catch (e) {}
};
