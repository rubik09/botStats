import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {SessionsRepository} from "./sessions.repository";
import telegramInit, {clientsTelegram} from "../utils/telegramInit";
import {StringSession} from "telegram/sessions";
import {TelegramClient} from "telegram";
import NewLogger from "../utils/newLogger";
import emmiter from "../utils/emitter";
import {Clients, ClientStartPromises, Promises, setupSteps, TABLE_LINK} from "../utils/config";
import {Sessions} from "./entity/sessions";
import {SaveMainInfoDto} from "./dto/saveMainInfo.dto";
import {UpdateSessionDto} from "./dto/updateSession.dto";
import {UpdateSessionInfoDto} from "./dto/updateSessionInfo.dto";
import {ConnectToTelegramDto} from "./dto/connectToTelegram.dto";


const clients: Clients = {};
const promises: Promises = {};
const clientStartPromise: ClientStartPromises = {};

function generatePromise(): Promises[string] {
    let resolve: (value: { account_password: string; phoneCode: number }) => void;
    let promise = new Promise<{ account_password: string; phoneCode: number }>((res) => {
        resolve = res;
    });

    return {resolve, promise};
}

@Injectable()
export class SessionsService {
    constructor(private sessionsRepository: SessionsRepository) {
    }

    private readonly logger = new Logger(SessionsService.name);

    async addSession(saveMainInfoDto: SaveMainInfoDto) {
        this.logger.log(`Trying to save main info`);
        const {
            phoneNumber, userId, username,
        } = saveMainInfoDto;

        const [validPhone, validUserId, validUsername] = await Promise.all([
            this.sessionsRepository.checkByPhone(phoneNumber),
            this.sessionsRepository.checkByUserId(userId),
            this.sessionsRepository.checkByUsername(username),
        ]);

        if (validPhone || validUserId || validUsername) {
            throw new HttpException('One or more fields already exist', HttpStatus.BAD_REQUEST);
        }

        await this.sessionsRepository.saveMainInfo(saveMainInfoDto);
        this.logger.log(`Successfully save main info`)
    }

    async changeSessionsStatus(id: Sessions['id']) {
        this.logger.log(`Trying to update session status by id: ${id}`);

        const checkSession = await this.sessionsRepository.getSessionById(id);

        if (!(<any>checkSession).length) {
            this.logger.log(`session with user id: ${id} not found`);
            return false
        }

        const status = await this.sessionsRepository.getStatusById(id);

        await this.sessionsRepository.changeStatus(id, !status.status);

        const session = await this.sessionsRepository.checkByUserId(id);
        const {
            logSession, apiHash, apiId, userId,
        } = session;

        if (!status.status) {
            await telegramInit(logSession, String(apiId), apiHash, String(userId));
        } else {
            const client = clientsTelegram[userId];
            if (client) {
                await client.destroy();
                delete clientsTelegram[userId];
            }
        }

        this.logger.log(`Successfully update session keywords by apiId id: ${id}`)

        return status;
    }

    async connectToTelegram(connectToTelegramDto: ConnectToTelegramDto) {
        this.logger.log(`Trying to connect session to telegram`);

        const {
            setupStep, keywords, phoneCode, accountPassword, userId,
        } = connectToTelegramDto;
        let {apiId, apiHash} = connectToTelegramDto;
        let stringSession = new StringSession('');
        let phoneNumber = await this.sessionsRepository.getPhoneById(userId);

        if (!apiHash || !apiId) {
            const mainInfo = await this.sessionsRepository.getMainInfoByUserId(userId);

            apiId = mainInfo.apiId;
            apiHash = mainInfo.apiHash;
            stringSession = new StringSession(mainInfo.logSession);
        }

        if (setupStep === setupSteps.firstStep) {
            this.logger.log(`First connection step start`);
            const client = new TelegramClient(stringSession, +apiId, apiHash, {
                connectionRetries: 5,
                sequentialUpdates: true,
                baseLogger: new NewLogger(),
            });

            clients[userId] = client;
            await client.connect();
            client.floodSleepThreshold = 300;

            promises[userId] = generatePromise();

            clientStartPromise[userId] = client.start({
                phoneNumber: phoneNumber.phoneNumber,
                password: async () => {
                    const password = await promises[userId].promise;
                    promises[userId] = generatePromise();
                    return password.account_password;
                },
                phoneCode: async () => {
                    const codeProm = await promises[userId].promise;
                    promises[userId] = generatePromise();
                    return codeProm.phoneCode.toString(); // Convert the number to a string
                },
                onError: () => {
                    throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
                },
            });

            const updateSessionInfoDto = new UpdateSessionInfoDto();
            updateSessionInfoDto.apiHash = apiHash;
            updateSessionInfoDto.userId = userId;

            await this.sessionsRepository.updateSessionInfo(+apiId, updateSessionInfoDto);

            this.logger.log(`First connection step successfully ended`);
        } else if (setupStep === setupSteps.secondStep) {
            this.logger.log(`Second connection step start`);
            await promises[userId].resolve({account_password: accountPassword, phoneCode});
            await promises[userId].resolve({account_password: accountPassword, phoneCode});
            const client = clients[userId];
            const logSession: any = await client.session.save();
            await this.sessionsRepository.updateLogSession(logSession, userId);

            await clientStartPromise[userId];

            await this.sessionsRepository.updateStatus(true, userId);

            this.logger.log(`Second connection step successfully ended`);
        } else if (setupStep === setupSteps.thirdStep) {
            this.logger.log(`Third connection step start`);
            await this.sessionsRepository.updateKeywordsToSession(JSON.stringify(keywords), userId);
            const client = clients[userId];
            emmiter.emit('newClient', client);
            this.logger.log(`Third connection step successfully ended`);
        }
    }

    async getAllSessions() {
        this.logger.log(`Trying to get all sessions`);
        const sessions = await this.sessionsRepository.getSessions();

        sessions.length ? this.logger.log(`Successfully find all sessions`) : this.logger.log(`sessions not found`);

        const usersToSend = sessions.map(({region, status, username, id}) => ({
            region,
            status,
            username,
            id,
            TABLE_LINK
        }));

        return {
            message: 'Success',
            usersToSend,
        };
    }

    async getSessionById(id: Sessions['id']) {
        this.logger.log(`Trying to get session by id: ${id}`);
        const session = await this.sessionsRepository.getSessionById(id);
        if (!(<any>session).length) {
            throw new HttpException('session not exist', HttpStatus.NOT_FOUND);
        }
        const {
            userId, phoneNumber, region, username, keywords,
        } = session;

        (<any>session).length ? this.logger.log(`Successfully find session by id: ${id}`) : this.logger.log(`session with id: ${id} not found`);

        return {
            message: 'Success',
            session: {
                id, userId, phoneNumber, region, username, keywords,
            },
        };
    }

    async updateSession(id: Sessions['id'], updateSessionDto: UpdateSessionDto) {
        this.logger.log(`Trying to update session by id: ${id}`);

        const session = await this.sessionsRepository.getSessionById(id);

        if (!(<any>session).length) {
            this.logger.log(`session with user id: ${id} not found`);
            return false
        }

        await this.sessionsRepository.updateSessionById(id, updateSessionDto);

        this.logger.log(`Successfully update session by id: ${id}`)

        return {
            message: 'Success',
        };
    }

    async deleteSession(id: Sessions['id']) {
        this.logger.log(`Trying to delete session by id: ${id}`);
        const session = await this.sessionsRepository.getSessionById(id);

        if (!(<any>session).length) {
            throw new HttpException('user not exist', HttpStatus.NOT_FOUND);
        }

        await this.sessionsRepository.deleteSession(id);

        this.logger.log(`Successfully deleted by id: ${id}`)
        return {
            message: 'Success',
        };
    }
}
