import {Injectable} from '@nestjs/common';
import {Kafka} from 'kafkajs';
import {TOPIC_NAMES} from "../utils/config";

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['kafka1:9092', 'kafka2:9092']
})
const producer = kafka.producer()
const consumerIncoming = kafka.consumer({groupId: 'incoming'})
const consumerOutgoing = kafka.consumer({groupId: 'outgoing'})


@Injectable()
export class KafkaBufferService {
    writeMessage = async (message, topicName) => {
        await producer.connect()
        await producer.send({
            topic: topicName,
            messages: [
                message
            ],
        })
    }

    readIncomingMessages = async () => {
        await consumerIncoming.connect()
        await consumerIncoming.subscribe({topic: TOPIC_NAMES.INCOMING_MESSAGE, fromBeginning: true})
        await consumerIncoming.run({
            eachMessage: async ({message}) => {
                // calculation logic
            },
        })
    }

    readOutgoingMessages = async () => {
        await consumerOutgoing.connect()
        await consumerOutgoing.subscribe({topic: TOPIC_NAMES.OUTGOING_MESSAGE, fromBeginning: true})
        await consumerOutgoing.run({
            eachMessage: async ({message}) => {
                // calculation logic
            },
        })
    }
}
