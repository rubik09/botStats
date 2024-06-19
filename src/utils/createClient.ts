import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import config from '../configuration/config';
import * as TelegramBot from 'node-telegram-bot-api';

import { createClientConfig } from './consts';
import { ICreateClient } from './interfaces';
import NewLogger from './newLogger';

const { CHAT_ID_ALERT, BOT_TOKEN_ALERT } = config();

const botAlert = new TelegramBot(BOT_TOKEN_ALERT);

export const createClient = async ({ logSession, apiId, apiHash }: ICreateClient) => {
  const stringSession = new StringSession(logSession);
  const client = new TelegramClient(stringSession, Number(apiId), apiHash, {
    connectionRetries: 5,
    sequentialUpdates: true,
    baseLogger: new NewLogger(),
  });

  const connectWithRetry = async (attempt = 1) => {
    const isConnect = await client.connect();
    if (!isConnect) {
      attempt < createClientConfig.maxRetries
        ? await connectWithRetry(attempt + 1)
        : await botAlert.sendMessage(CHAT_ID_ALERT, createClientConfig.errorMessage);
    }
  };

  await botAlert.sendMessage(CHAT_ID_ALERT, createClientConfig.errorMessage);

  await connectWithRetry();
  client.floodSleepThreshold = 300;

  return client;
};
