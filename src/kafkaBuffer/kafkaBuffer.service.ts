import {Injectable} from '@nestjs/common';
import {Kafka} from 'kafkajs';
import {TOPIC_NAMES} from "../utils/config";

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
})
const producer = kafka.producer()
const consumerIncoming = kafka.consumer({groupId: 'incoming'})
const consumerOutgoing = kafka.consumer({groupId: 'outgoing'})


@Injectable()
export class KafkaBufferService {
    async writeMessage(messages: [], topicName: string) {
        await producer.connect()
        await producer.send({
            topic: topicName,
            messages: messages
        })
    }

    async runListening() {
        await consumerIncoming.connect();
        await consumerIncoming.subscribe({topic: TOPIC_NAMES.INCOMING_MESSAGE});
        await consumerIncoming.run({
            eachMessage: async ({message}) => {
                //calc incoming message logic
            },
        });

        await consumerOutgoing.connect();
        await consumerOutgoing.subscribe({topic: TOPIC_NAMES.OUTGOING_MESSAGE});
        await consumerOutgoing.run({
            eachMessage: async ({message}) => {
                //calc outgoing messages logic
            },
        });
    }
}
