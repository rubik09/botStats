import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Consumer, ConsumerRunConfig, ConsumerSubscribeTopics, Kafka } from 'kafkajs';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  private readonly kafka = new Kafka(this.configService.get('KAFKA'));
  private readonly consumers: Consumer[] = [];

  constructor(private readonly configService: ConfigService) {}

  async consume(topic: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
    const groupId = this.configService.get('GROUP_ID');
    const consumer = this.kafka.consumer({
      groupId: 'nestjs-kafka-' + groupId,
    });
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
