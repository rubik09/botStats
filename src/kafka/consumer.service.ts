import {Injectable, OnApplicationShutdown} from '@nestjs/common';
import {Kafka, Consumer, ConsumerSubscribeTopics, ConsumerRunConfig} from 'kafkajs';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
    private readonly kafka = new Kafka(this.configService.get('KAFKA'));
    private readonly consumers: Consumer[] = [];

    constructor(private readonly configService: ConfigService) {
    }

    async consume(topic: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
        const groupId = this.configService.get('GROUP_ID');
        const consumer = this.kafka.consumer({groupId: 'nestjs-kafka-' + groupId});
        await consumer.connect();
        await consumer.subscribe(topic);
        await consumer.run(config);
        this.consumers.push(consumer);
    }

    async onApplicationShutdown() {
        for (const consumer of this.consumers) {
            await consumer.disconnect();
        }
    }
}
