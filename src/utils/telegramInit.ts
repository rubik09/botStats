import {StringSession} from 'telegram/sessions';
import {TelegramClient} from 'telegram';
import emmiter from './emitter';
import NewLogger from './newLogger';

interface YourClientType {
    id: number;
    name: string;
}

export const clientsTelegram: Record<string, TelegramClient> = {};

async function telegramInit(log_session: string, api_id: string, api_hash: string, client_id: string) {
    const stringSession = new StringSession(log_session);
    const client = new TelegramClient(stringSession, +api_id, api_hash, {
        connectionRetries: 5,
        sequentialUpdates: true,
        baseLogger: new NewLogger(),
    });

    await client.connect();
    await client.checkAuthorization();
    clientsTelegram[client_id] = client;
    client.floodSleepThreshold = 300;

    emmiter.emit('newClient', client);
}

export default telegramInit;
