import {TelegramClient} from 'telegram';
import emitterSubject from './emitter';
import {createClient} from "./createClient";
import {ITelegramInit} from "./interfaces";

export const clientsTelegram: Record<string, TelegramClient> = {};


async function telegramInit({logSession, apiId, apiHash, telegramId}: ITelegramInit) {
    const client = await createClient({logSession, apiId, apiHash})


    await client.checkAuthorization();
    clientsTelegram[telegramId] = client;

    emitterSubject.next({ eventName: 'newClient', data: client });
}

export default telegramInit;
