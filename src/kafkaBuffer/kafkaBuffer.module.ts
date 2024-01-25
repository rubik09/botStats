import {Module, OnModuleInit} from '@nestjs/common';
import {KafkaBufferService} from "./kafkaBuffer.service";

@Module({
    providers: [KafkaBufferService]
})


export class KafkaBufferModule implements OnModuleInit {

    constructor(private kafkaBufferService: KafkaBufferService) {
    }

    async onModuleInit() {
        await this.kafkaBufferService.runListening();
    }
}
