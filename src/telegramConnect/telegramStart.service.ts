import { Injectable, OnModuleInit } from "@nestjs/common";
import { UserSessionService } from "../userSession/userSession.service";
import emitterSubject from "../utils/emitter";
import { ProducerService } from "../kafka/producer.service";
import { NewMessage } from "telegram/events";
import { ConfigService } from "@nestjs/config";
import telegramAccountsInit from "../utils/telegramInit";
import { TelegramClient } from "telegram";

@Injectable()
export class TelegramStartService implements OnModuleInit {
  constructor(
    private userSessionService: UserSessionService,
    private producerService: ProducerService,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    const { INCOMING_MESSAGE, OUTGOING_MESSAGE } =
      this.configService.get("KAFKA_TOPICS");

    emitterSubject.subscribe(
      async (eventObj: { eventName: string; data: TelegramClient }) => {
        if (eventObj.eventName !== "newClient") return;
        const client = eventObj.data;
        client.addEventHandler(
          async (event: any) => {
            const { className, userId } = event.originalUpdate;

            if (className !== "UpdateShortMessage") return;

            const clientInfoObj = {
              apiId: client.apiId,
              telegramId: Number(userId),
            };
            const clientInfoStr = JSON.stringify(clientInfoObj);

            await this.producerService.produce({
              topic: INCOMING_MESSAGE,
              messages: [{ value: clientInfoStr }],
            });
          },
          new NewMessage({ incoming: true }),
        );
      },
    );

    emitterSubject.subscribe(
      async (eventObj: { eventName: string; data: TelegramClient }) => {
        if (eventObj.eventName !== "newClient") return;
        const client = eventObj.data;
        client.addEventHandler(
          async (event: any) => {
            const { className } = event.originalUpdate;

            if (className !== "UpdateShortMessage") return;

            const { message } = event.originalUpdate;

            const clientInfoObj = { apiId: client.apiId, message };
            const clientInfoStr = JSON.stringify(clientInfoObj);

            await this.producerService.produce({
              topic: OUTGOING_MESSAGE,
              messages: [{ value: clientInfoStr }],
            });
          },
          new NewMessage({ outgoing: true }),
        );
      },
    );

    const allSessions = await this.userSessionService.getActiveUserSessions();

    await telegramAccountsInit(allSessions);
  }
}
