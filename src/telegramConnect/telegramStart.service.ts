import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegramClient } from 'telegram';
import { NewMessage } from 'telegram/events';

import { ProducerService } from '../kafka/producer.service';
import { UserSessionService } from '../userSession/userSession.service';
import emitterSubject from '../utils/emitter';
import telegramAccountsInit from '../utils/telegramAccountsInit';

@Injectable()
export class TelegramStartService implements OnModuleInit {
  private readonly incomingMessage: string;
  private readonly outgoingMessage: string;
  constructor(
    private userSessionService: UserSessionService,
    private producerService: ProducerService,
    private configService: ConfigService,
  ) {
    this.incomingMessage = this.configService.getOrThrow('KAFKA_TOPICS.INCOMING_MESSAGE');
    this.outgoingMessage = this.configService.getOrThrow('KAFKA_TOPICS.OUTGOING_MESSAGE');
  }

  async onModuleInit() {
    emitterSubject.subscribe(async (eventObj: { eventName: string; data: TelegramClient }) => {
      if (eventObj.eventName !== 'newClient') return;
      const client = eventObj.data;
      client.addEventHandler(
        async (event: any) => {
          const { className, userId } = event.originalUpdate;

          if (className !== 'UpdateShortMessage') return;

          const clientInfoObj = {
            apiId: client.apiId,
            telegramId: Number(userId),
          };
          const clientInfoStr = JSON.stringify(clientInfoObj);

          await this.producerService.produce({
            topic: this.incomingMessage,
            messages: [{ value: clientInfoStr }],
          });
        },
        new NewMessage({ incoming: true }),
      );
    });

    emitterSubject.subscribe(async (eventObj: { eventName: string; data: TelegramClient }) => {
      if (eventObj.eventName !== 'newClient') return;
      const client = eventObj.data;
      client.addEventHandler(
        async (event: any) => {
          const { className } = event.originalUpdate;

          if (className !== 'UpdateShortMessage') return;

          const { message } = event.originalUpdate;

          const clientInfoObj = { apiId: client.apiId, message };
          const clientInfoStr = JSON.stringify(clientInfoObj);

          await this.producerService.produce({
            topic: this.outgoingMessage,
            messages: [{ value: clientInfoStr }],
          });
        },
        new NewMessage({ outgoing: true }),
      );
    });

    const allSessions = await this.userSessionService.getActiveUserSessions();

    await telegramAccountsInit(allSessions);
  }
}
