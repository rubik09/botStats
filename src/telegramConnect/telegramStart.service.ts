import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {UserSessionService} from "../userSession/userSession.service";
import emitterSubject from "../utils/emitter";
import {ProducerService} from "../kafka/producer.service";
import {NewMessage} from "telegram/events";
import {ConfigService} from "@nestjs/config";
import arrTelegramInit from "../utils/telegramInit";

@Injectable()
export class TelegramStartService implements OnModuleInit {
    private readonly logger = new Logger(TelegramStartService.name);

    constructor(
        private userSessionService: UserSessionService,
        private producerService: ProducerService,
        private configService: ConfigService,
    ) {
    }

    async onModuleInit() {
        const {
            INCOMING_MESSAGE,
            OUTGOING_MESSAGE,
        } = this.configService.get('KAFKA_TOPICS');

        emitterSubject.subscribe(async (eventObj: { eventName: string, data: any }) => {
                if (eventObj.eventName !== 'newClient') return
                const client = eventObj.data;
                client.addEventHandler(
                    async (event: any) => {
                        const {className, userId} = event;
                        if (className !== 'UpdateShortMessage') return;

                        const dataObj = {apiId: client.apiId, telegramId: userId};
                        const dataObjStr = JSON.stringify(dataObj);

                        await this.producerService.produce({
                            topic: INCOMING_MESSAGE,
                            messages: [{value: dataObjStr}]
                        });
                        new NewMessage({incoming: true})
                    }
                );
            },
        );

        const allSessions = await this.userSessionService.getActiveUserSessions();

        await arrTelegramInit(allSessions);
    }

}
