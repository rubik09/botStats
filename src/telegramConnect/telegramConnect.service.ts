import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {StringSession} from "telegram/sessions";
import emmiter from "../utils/emitter";
import {TelegramClient} from "telegram";
import NewLogger from "../utils/newLogger";
import {UpdateUserSessionInfoDto} from "../userSession/dto/updateUserSession.dto";
import {userSessionStatus} from "../userSession/entity/userSession.entity";
import {TClients, TClientStartPromises, TPromises, TPromiseValue} from "../utils/interfaces";
import {CreateTelegramConnectionDto} from "./dto/createTelegramConnect.dto";
import {UserSessionService} from "../userSession/userSession.service";

const setupSteps = {
    firstStep: 1,
    secondStep: 2,
    thirdStep: 3,
}

const clients: TClients = {};
const promises: TPromises = {};
const clientStartPromise: TClientStartPromises = {};

function generatePromise(): TPromises[number] {
    let resolve: (value: TPromiseValue) => void;
    let promise = new Promise<TPromiseValue>((res) => {
        resolve = res;
    });

    return {resolve, promise};
}

@Injectable()
export class TelegramConnectService {
    constructor(private userSessionService: UserSessionService) {
    }

    async connectToTelegram(createTelegramConnectionDto: CreateTelegramConnectionDto) {
        const {
            setupStep, keywords, code, telegramId, accountPassword, apiId, apiHash
        } = createTelegramConnectionDto;
        let stringSession = new StringSession('');
        const {personalInfo} = await this.userSessionService.getPersonalInfoByTelegramId(telegramId);
        let {phoneNumber} = personalInfo;

        if (setupStep === setupSteps.firstStep) {
            const client = new TelegramClient(stringSession, Number(apiId), apiHash, {
                connectionRetries: 5,
                sequentialUpdates: true,
                baseLogger: new NewLogger(),
            });

            clients[telegramId] = client;
            await client.connect();
            client.floodSleepThreshold = 300;

            promises[telegramId] = generatePromise();

            clientStartPromise[telegramId] = client.start({
                phoneNumber: phoneNumber,
                password: async () => {
                    const password = await promises[telegramId].promise;
                    promises[telegramId] = generatePromise();
                    return password.accountPassword;
                },
                phoneCode: async () => {
                    const codeProm = await promises[telegramId].promise;
                    promises[telegramId] = generatePromise();
                    return codeProm.phoneCode;
                },
                onError: () => {
                    throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
                },
            });

            const updateUserSessionInfoDto = <UpdateUserSessionInfoDto>{
                apiId,
                apiHash,
            };

            await this.userSessionService.updateUserSessionInfo(telegramId, updateUserSessionInfoDto);

            return;
        } else if (setupStep === setupSteps.secondStep) {
            await promises[telegramId].resolve({accountPassword: accountPassword, phoneCode: code});
            await promises[telegramId].resolve({accountPassword: accountPassword, phoneCode: code});
            const client = clients[telegramId];
            const logSession = client.session.save();
            await this.userSessionService.updateLogSession(logSession, telegramId);

            await clientStartPromise[telegramId];

            await this.userSessionService.updateStatus(userSessionStatus.ACTIVE, telegramId);

            return;
        } else if (setupStep === setupSteps.thirdStep) {
            await this.userSessionService.updateKeywordsToUserSession(JSON.stringify(keywords), telegramId);
            const client = clients[telegramId];
            emmiter.emit('newClient', client);

            return;
        }
    }
}
