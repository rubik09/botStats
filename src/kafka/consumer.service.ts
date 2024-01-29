import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Kafka, Consumer, ConsumerSubscribeTopics, ConsumerRunConfig } from 'kafkajs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  private readonly kafka = new Kafka(this.configService.get('app-config.KAFKA'));
  private readonly consumers: Consumer[] = [];
  constructor(private readonly configService: ConfigService) {}
  async consume(topic: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
    const GROUPID = this.configService.get('app-config.GROUP_ID').GROUPID;
    const consumer = this.kafka.consumer({ groupId: 'nestjs-kafka' + GROUPID });
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
