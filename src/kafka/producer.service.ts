import {Injectable, OnModuleInit, OnApplicationShutdown} from '@nestjs/common';
import {Kafka, Producer, ProducerRecord} from 'kafkajs';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class ProducerService implements OnModuleInit, OnApplicationShutdown {
    private readonly kafka = new Kafka(this.configService.get('KAFKA_CONFIG.KAFKA'));
    private readonly producer: Producer = this.kafka.producer();

    constructor(private readonly configService: ConfigService) {
    }

    async onModuleInit() {
        await this.producer.connect();
    }

    async onApplicationShutdown() {
        await this.producer.disconnect();
    }

    async produce(record: ProducerRecord) {
        await this.producer.send(record);
    }
}

