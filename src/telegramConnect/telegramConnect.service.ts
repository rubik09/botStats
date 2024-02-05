import {HttpException, HttpStatus, Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {StringSession} from "telegram/sessions";
import emmiter from "../utils/emitter";
import {TelegramClient} from "telegram";
import NewLogger from "../utils/newLogger";
import {UpdateUserSessionInfoDto} from "../userSession/dto/updateUserSession.dto";
import {userSessionStatus} from "../userSession/entity/userSession.entity";
import {IClients, IClientStartPromises, IFirstStep, IPromises, ISecondStep, IThirdStep} from "../utils/interfaces";
import {CreateTelegramConnectionDto} from "./dto/createTelegramConnect.dto";
import {UserSessionService} from "../userSession/userSession.service";
import {UpdateApiInfoDto} from "../userSession/dto/updateApiInfo.dto";
import {setupSteps} from "../utils/consts";
import {TSetupSteps} from "../utils/types";
import generatePromise from "../utils/TelegramPromiseGeneration";

const clients: IClients = {};
const promises: IPromises = {};
const clientStartPromise: IClientStartPromises = {};

@Injectable()
export class TelegramConnectService implements OnModuleInit {
    private connectionStepFunctions: TSetupSteps;
    private readonly logger = new Logger(TelegramConnectService.name);
    constructor(private userSessionService: UserSessionService) {
    }

    async firstConnectionStep({ apiId, apiHash, telegramId }: IFirstStep) {
        this.logger.log(`Run first connection step`);

        this.logger.log(`First connection step: apiId: ${apiId}, apiHash: ${apiHash}, telegramId: ${telegramId}`);

        const stringSession = new StringSession('');
        const {personalInfo} = await this.userSessionService.getPersonalInfoByTelegramId(telegramId);
        const {phoneNumber} = personalInfo;

        this.logger.log(`First connection step: creating client`);
        const client = new TelegramClient(stringSession, Number(apiId), apiHash, {
            connectionRetries: 5,
            sequentialUpdates: true,
            baseLogger: new NewLogger(),
        });

        clients[telegramId] = client;
        await client.connect();
        client.floodSleepThreshold = 300;
        this.logger.log(`First connection step: client connection`);


        promises[telegramId] = generatePromise();

        this.logger.log(`First connection step: generating promises and wait code with password`);

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
                this.logger.log(`First connection step: error on client.start`);
                throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
            },
        });

        const updateApiInfoDto: UpdateApiInfoDto = {
            apiId,
            apiHash,
        };

        await this.userSessionService.updateApiInfoByTelegramId(telegramId, updateApiInfoDto);

        this.logger.log(`First connection step: successfully ended`);
    }

    async secondConnectionStep({accountPassword, code, telegramId}: ISecondStep) {
        this.logger.log(`Run second connection step`);

        this.logger.log(`Second connection step: accountPassword: ${accountPassword}, code: ${code}, telegramId: ${telegramId}`);

        await promises[telegramId].resolve({accountPassword: accountPassword, phoneCode: code});
        await promises[telegramId].resolve({accountPassword: accountPassword, phoneCode: code});

        this.logger.log(`Second connection step: resolving code and password promises`);


        const client = clients[telegramId];
        const logSession = String(client.session.save());
        await clientStartPromise[telegramId];

        this.logger.log(`Second connection step: save log session`);


        const updateUserSessionInfoDto: UpdateUserSessionInfoDto = {
            logSession,
            status: userSessionStatus.ACTIVE,
        };

        await this.userSessionService.updateUserSessionByTelegramId(telegramId, updateUserSessionInfoDto);

        this.logger.log(`Second connection step: successfully ended`);
    }

    async thirdConnectionStep({keywords, telegramId}: IThirdStep) {
        this.logger.log(`Run third connection step`);

        this.logger.log(`Third connection step: keywords: ${keywords}, telegramId: ${telegramId}`);

        const updateUserSessionInfoDto: UpdateUserSessionInfoDto = {
            keywords,
        };
        await this.userSessionService.updateUserSessionByTelegramId(telegramId, updateUserSessionInfoDto);
        const client = clients[telegramId];

        this.logger.log(`Third connection step: run emmiter`);

        emmiter.emit('newClient', client);

        this.logger.log(`Third connection step: successfully ended`);
    }

     onModuleInit() {
        this.connectionStepFunctions = {
            [setupSteps.FIRST_STEP]: async ({ apiId, apiHash, telegramId }: CreateTelegramConnectionDto) => this.firstConnectionStep({
                apiId,
                apiHash,
                telegramId
            }),
            [setupSteps.SECOND_STEP]: async ({ accountPassword, code, telegramId }: CreateTelegramConnectionDto) => this.secondConnectionStep({
                accountPassword,
                code,
                telegramId
            }),
            [setupSteps.THIRD_STEP]: async ({ keywords, telegramId }: CreateTelegramConnectionDto) => this.thirdConnectionStep({
                keywords,
                telegramId
            }),
        };
    }

    async connectToTelegram(createTelegramConnectionDto: CreateTelegramConnectionDto) {
        const {setupStep} = createTelegramConnectionDto

        this.logger.log(`Main connectToTelegram function: run step ${setupStep}`);

        return this.connectionStepFunctions[setupStep as setupSteps](createTelegramConnectionDto);
    }
}
