import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { ConsumerService } from "./consumer.service";
import { ConfigService } from "@nestjs/config";
import { StatsService } from "../stats/stats.service";

@Injectable()
export class VerificationConsumer implements OnModuleInit {
  private readonly logger = new Logger(VerificationConsumer.name);

  constructor(
    private readonly consumerService: ConsumerService,
    private readonly configService: ConfigService,
    private readonly statsService: StatsService,
  ) {}

  async onModuleInit() {
    const { INCOMING_MESSAGE, OUTGOING_MESSAGE } =
      this.configService.get("KAFKA_TOPICS");
    await this.consumerService.consume(
      {
        topics: [INCOMING_MESSAGE, OUTGOING_MESSAGE],
      },
      {
        eachMessage: async ({ message, topic }) => {
          try {
            const clientInfoStr = message.value.toString();
            this.logger.debug(`${topic} : ${clientInfoStr}`);
            if (topic === OUTGOING_MESSAGE) {
              await this.statsService.outgoingMessages(clientInfoStr);
            }
            if (topic === INCOMING_MESSAGE) {
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
