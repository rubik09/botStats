import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {StringSession} from "telegram/sessions";
import emmiter from "../utils/emitter";
import {UserSessionRepository} from "../userSession/userSession.repository";
import {TelegramClient} from "telegram";
import NewLogger from "../utils/newLogger";
import {UpdateUserSessionInfoDto} from "../userSession/dto/updateUserSession.dto";
import {userSessionStatus} from "../userSession/entity/userSession.entity";
import {Clients, ClientStartPromises, Promises} from "../utils/interfaces";
import {CreateTelegramConnectionDto} from "./dto/createTelegramConnect.dto";

const setupSteps = {
    firstStep: 1,
    secondStep: 2,
    thirdStep: 3,
}

const clients: Clients = {};
const promises: Promises = {};
const clientStartPromise: ClientStartPromises = {};

function generatePromise(): Promises[string] {
    let resolve: (value: { accountPassword: string; phoneCode: string }) => void;
    let promise = new Promise<{ accountPassword: string; phoneCode: string }>((res) => {
        resolve = res;
    });

    return {resolve, promise};
}

@Injectable()
export class TelegramConnectService {
    constructor(private userSessionRepository: UserSessionRepository) {
    }

    async connectToTelegram(createTelegramConnectionDto: CreateTelegramConnectionDto) {
        const {
            setupStep, keywords, code, telegramId, accountPassword,
        } = createTelegramConnectionDto;
        let {apiId, apiHash} = createTelegramConnectionDto;
        let stringSession = new StringSession('');
        const mainInfo = await this.userSessionRepository.getMainInfoByTelegramId(telegramId);
        let phoneNumber = mainInfo.personalInfo.phoneNumber;

        if (!apiHash || !apiId) {
            apiId = mainInfo.apiId;
            apiHash = mainInfo.apiHash;
            stringSession = new StringSession(mainInfo.logSession);
        }

        if (setupStep === setupSteps.firstStep) {
            const client = new TelegramClient(stringSession, +apiId, apiHash, {
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

            const updateUserSessionInfoDto = new UpdateUserSessionInfoDto();
            updateUserSessionInfoDto.apiId = apiId;
            updateUserSessionInfoDto.apiHash = apiHash;

            await this.userSessionRepository.updateUserSessionInfo(telegramId, updateUserSessionInfoDto);

        } else if (setupStep === setupSteps.secondStep) {
            await promises[telegramId].resolve({accountPassword: accountPassword, phoneCode: code});
            await promises[telegramId].resolve({accountPassword: accountPassword, phoneCode: code});
            const client = clients[telegramId];
            const logSession = client.session.save();
            await this.userSessionRepository.updateLogSession(logSession, telegramId);

            await clientStartPromise[telegramId];

            await this.userSessionRepository.updateStatus(userSessionStatus.ACTIVE, telegramId);

        } else if (setupStep === setupSteps.thirdStep) {
            await this.userSessionRepository.updateKeywordsToUserSession(JSON.stringify(keywords), telegramId);
            const client = clients[telegramId];
            emmiter.emit('newClient', client);
        }
    }
}
