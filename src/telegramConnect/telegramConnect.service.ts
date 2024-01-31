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
import {PersonalInfo} from "../personalInfo/entity/personalInfo.entity";
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

    async firstConnectionStep(createTelegramConnectionDto: CreateTelegramConnectionDto, phoneNumber: PersonalInfo["phoneNumber"], stringSession: StringSession) {
        const {apiId, apiHash, telegramId} = createTelegramConnectionDto;

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

        const updateApiInfoDto = <UpdateApiInfoDto>{
            apiId,
            apiHash,
        };

        await this.userSessionService.updateApiInfoByTelegramId(telegramId, updateApiInfoDto);
        return;
    }

    async secondConnectionStep(createTelegramConnectionDto: CreateTelegramConnectionDto) {
        const {telegramId, accountPassword, code} = createTelegramConnectionDto;
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
        return;
    }

    async thirdConnectionStep(createTelegramConnectionDto: CreateTelegramConnectionDto) {
        const {keywords, telegramId} = createTelegramConnectionDto;
        const updateUserSessionInfoDto = <UpdateUserSessionInfoDto>{
            keywords,
        };
        await this.userSessionService.updateUserSessionByTelegramId(telegramId, updateUserSessionInfoDto);
        const client = clients[telegramId];
        emmiter.emit('newClient', client);
        return;
    }

    async connectToTelegram(createTelegramConnectionDto: CreateTelegramConnectionDto) {
        const {telegramId, setupStep} = createTelegramConnectionDto;
        const stringSession = new StringSession('');
        const {personalInfo} = await this.userSessionService.getPersonalInfoByTelegramId(telegramId);
        const {phoneNumber} = personalInfo;

        if (setupStep === setupSteps.firstStep) {
            await this.firstConnectionStep(createTelegramConnectionDto, phoneNumber, stringSession);
            return;
        } else if (setupStep === setupSteps.secondStep) {
            await this.secondConnectionStep(createTelegramConnectionDto);
            return;
        } else if (setupStep === setupSteps.thirdStep) {
            await this.thirdConnectionStep(createTelegramConnectionDto);
            return;
        }
    }
}
