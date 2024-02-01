import {Injectable, OnModuleInit, Logger} from '@nestjs/common';
import {ConsumerService} from './consumer.service';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class VerificationConsumer implements OnModuleInit {
    private readonly logger = new Logger(VerificationConsumer.name);

    constructor(
        private readonly consumerService: ConsumerService,
        private readonly configService: ConfigService,
    ) {
    }

    async onModuleInit() {
        const {
            INCOMING_MESSAGE,
            OUTGOING_MESSAGE,
        } = this.configService.get('KAFKA_TOPICS');
        await this.consumerService.consume(
            {
                topics: [
                    INCOMING_MESSAGE,
                    OUTGOING_MESSAGE,
                ],
            },
            {
                eachMessage: async ({message, topic}) => {
                    const incomeMessage = message.value.toString();
                    this.logger.log(`${topic} : ${incomeMessage}`);
                    if (topic === OUTGOING_MESSAGE) {
                        //outgoing func
                    }
                    if (topic === INCOMING_MESSAGE) {
                        //incoming func
                    }
                },
            },
        );
    }
}