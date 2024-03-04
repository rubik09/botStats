import { TelegramClient } from "telegram";
import emitterSubject from "./emitter";
import { createClient } from "./createClient";
import { ITelegramInit } from "./interfaces";
import { UserSession } from "../userSession/entity/userSession.entity";

export const clientsTelegram: Record<string, TelegramClient> = {};

async function telegramInit({
  logSession,
  apiId,
  apiHash,
  telegramId,
}: ITelegramInit) {
  const client = await createClient({ logSession, apiId, apiHash });

  await client.checkAuthorization();
  clientsTelegram[telegramId] = client;

  emitterSubject.next({ eventName: "newClient", data: client });
}

async function telegramAccountsInit(allSessions: UserSession[]) {
  for (const session of allSessions) {
    const { logSession, status, apiId, apiHash, telegramId } = session;

    if (!status) continue;

    await telegramInit({ logSession, apiId, apiHash, telegramId });
  }
}

export default telegramAccountsInit;
