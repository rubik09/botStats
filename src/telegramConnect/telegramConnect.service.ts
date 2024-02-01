import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {StringSession} from "telegram/sessions";
import emmiter from "../utils/emitter";
import {TelegramClient} from "telegram";
import NewLogger from "../utils/newLogger";
import {UpdateUserSessionInfoDto} from "../userSession/dto/updateUserSession.dto";
import {UserSession, userSessionStatus} from "../userSession/entity/userSession.entity";
import {TClients, TClientStartPromises, TPromises, TPromiseValue, TSetupSteps} from "../utils/interfaces";
import {CreateTelegramConnectionDto} from "./dto/createTelegramConnect.dto";
import {UserSessionService} from "../userSession/userSession.service";
import {UpdateApiInfoDto} from "../userSession/dto/updateApiInfo.dto";
import {setupSteps} from "../utils/consts";

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

    async firstConnectionStep(apiId: UserSession['apiId'], apiHash: UserSession['apiHash'], telegramId: UserSession['telegramId']) {

        const stringSession = new StringSession('');
        const {personalInfo} = await this.userSessionService.getPersonalInfoByTelegramId(telegramId);
        const {phoneNumber} = personalInfo;

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
            onError: (e) => {
                console.log(e)
                throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
            },
        });

        const updateApiInfoDto = <UpdateApiInfoDto>{
            apiId,
            apiHash,
        };

        await this.userSessionService.updateApiInfoByTelegramId(telegramId, updateApiInfoDto);
    }

    async secondConnectionStep(accountPassword: string, code: string, telegramId: UserSession['telegramId']) {
        await promises[telegramId].resolve({accountPassword: accountPassword, phoneCode: code});
        await promises[telegramId].resolve({accountPassword: accountPassword, phoneCode: code});
        const client = clients[telegramId];
        const logSession = String(client.session.save());
        await clientStartPromise[telegramId];

        const updateUserSessionInfoDto = <UpdateUserSessionInfoDto>{
            logSession,
            status: userSessionStatus.ACTIVE,
        };
        await this.userSessionService.updateUserSessionByTelegramId(telegramId, updateUserSessionInfoDto);
    }

    async thirdConnectionStep(keywords: UserSession['keywords'], telegramId: UserSession['telegramId']) {
        const updateUserSessionInfoDto = <UpdateUserSessionInfoDto>{
            keywords,
        };
        await this.userSessionService.updateUserSessionByTelegramId(telegramId, updateUserSessionInfoDto);
        const client = clients[telegramId];
        emmiter.emit('newClient', client);
    }

    async connectToTelegram(createTelegramConnectionDto: CreateTelegramConnectionDto) {
        const {setupStep, apiId, apiHash, telegramId, accountPassword, code, keywords} = createTelegramConnectionDto

        const connectionStepFunctions: TSetupSteps = {
            [setupSteps.firstStep]: () => this.firstConnectionStep(apiId, apiHash, telegramId),
            [setupSteps.secondStep]: () => this.secondConnectionStep(accountPassword, code, telegramId),
            [setupSteps.thirdStep]: () => this.thirdConnectionStep(keywords, telegramId),
        };

        await connectionStepFunctions[setupStep](createTelegramConnectionDto);
    }
}
