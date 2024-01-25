import { Module } from '@nestjs/common';
import {KafkaBufferService} from "./kafkaBuffer.service";


@Module({})
export class KafkaBufferModule {
    providers: [KafkaBufferService,]
}
