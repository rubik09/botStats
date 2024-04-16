import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ConsumerService } from './consumer.service';
import { StatsService } from '../stats/stats.service';

@Injectable()
export class VerificationConsumer implements OnModuleInit {
  private readonly logger = new Logger(VerificationConsumer.name);
  private readonly incomingMessage: string;
  private readonly outgoingMessage: string;

  constructor(
    private readonly consumerService: ConsumerService,
    private readonly configService: ConfigService,
    private readonly statsService: StatsService,
  ) {
    this.incomingMessage = this.configService.getOrThrow('KAFKA_TOPICS.INCOMING_MESSAGE');
    this.outgoingMessage = this.configService.getOrThrow('KAFKA_TOPICS.OUTGOING_MESSAGE');
  }

  async onModuleInit() {
    await this.consumerService.consume(
      {
        topics: [this.incomingMessage, this.outgoingMessage],
      },
      {
        eachMessage: async ({ message, topic }) => {
          try {
            const clientInfoStr = message.value.toString();
            this.logger.debug(`${topic} : ${clientInfoStr}`);
            if (topic === this.outgoingMessage) {
              await this.statsService.outgoingMessages(clientInfoStr);
            }
            if (topic === this.incomingMessage) {
              await this.statsService.incomingMessages(clientInfoStr);
            }
          } catch (e) {
            this.logger.debug(e);
          }
        },
      },
    );
  }
}
