import {Injectable, Logger} from '@nestjs/common';
import {StatsRepository} from "./stats.repository";
import {SessionsRepository} from "../sessions/sessions.repository";
import {CreateStatDto} from "./dto/createStat.dto";
import {UsersRepository} from "../users/users.repository";
import {UpdateStatDto} from "./dto/updateStat.dto";
import zeroOutCounts from "../utils/zeroOutCounts";
import cron from "node-cron";
import {AddUserDto} from "../users/dto/addUser.dto";
import {FindUserDto} from "../users/dto/findUser.dto";
import {googleSheets} from "../utils/googleClient";
import {SHEET_ID, SPREADSHEET_ID} from "../utils/config";
import {StatsSendingDto} from "./dto/statsSending.dto";


@Injectable()
export class StatsService {
    constructor(private statsRepository: StatsRepository, private sessionsRepository: SessionsRepository, private usersRepository: UsersRepository) {
    }

    private readonly logger = new Logger(StatsService.name);

    statsCalculating() {
        this.logger.log(`Trying to start cron schedule}`);
        cron.schedule('0 0 * * *', async () => {
            this.logger.log(`Cron schedule iteration started}`);
            const activeAccounts = await this.sessionsRepository.getStatus();

            for (const account of activeAccounts) {
                const {apiId} = account;
                const statsArr = await this.statsRepository.getStatsByApiId(apiId);

                const createStatDto = new CreateStatDto();
                createStatDto.incomingMessagesCount = 0;
                createStatDto.apiIdClient = apiId;

                if (!(<any>statsArr).length) await this.statsRepository.addStats(createStatDto);
                const allUsers = await this.usersRepository.getCountUsers(apiId);
                const count = Object.values(allUsers)[0];
                const mainStats = await this.statsRepository.getStatsByApiId(apiId);
                const {incomingMessagesCount} = mainStats;
                const keywords = await this.sessionsRepository.getKeywordsFromSession(apiId);
                const parsedKeywords = JSON.parse(keywords.keywords);
                const username = await this.sessionsRepository.getUsernameFromSession(apiId);
                let averageMessagesCount = incomingMessagesCount / +count;
                if (incomingMessagesCount < 1 || count < 1) averageMessagesCount = 0;

                const statsSendingDto = new StatsSendingDto();
                statsSendingDto.username = username.username;
                statsSendingDto.incomingMessagesCount = incomingMessagesCount;
                statsSendingDto.usersCount = count;
                statsSendingDto.averageMessagesCount = +averageMessagesCount.toFixed(2);
                statsSendingDto.keywords = parsedKeywords;


                await this.statsSending(statsSendingDto);

                const newArr = zeroOutCounts(parsedKeywords);
                const stringifyNewArr = JSON.stringify(newArr);

                await this.sessionsRepository.updateKeywordsToSessionByApiId(stringifyNewArr, apiId);

                const updateStatDto = new UpdateStatDto();
                updateStatDto.incomingMessagesCount = 0;
                updateStatDto.usersCount = 0;
                updateStatDto.apiIdClient = apiId;

                await this.statsRepository.updateClientStats(updateStatDto);
                this.logger.log(`Cron schedule iteration successfully ended}`);
            }
            this.logger.log(`Users table trying to clean}`);
            await this.usersRepository.cleanTable();
            this.logger.log(`Users table successfully clean}`);
        }, {
            scheduled: true,
            timezone: "Europe/Moscow"
        });
    }

    async incomingMessages(client: any, event: any) {
        this.logger.log(`Trying to get incoming message}`);

        client.floodSleepThreshold = 300;
        client.setParseMode('html');

        const {className} = event.originalUpdate;
        if (className !== 'UpdateShortMessage') return;

        const {apiId} = client;
        const {userId} = event.originalUpdate;

        const findUserDto = new FindUserDto();
        findUserDto.userId = userId?.value;
        findUserDto.apiIdClient = apiId;

        const chatId = await this.usersRepository.findUserId(findUserDto);

        const addUserDto = new AddUserDto();
        addUserDto.userId = userId?.value;
        addUserDto.apiIdClient = apiId;

        if (!(<any>chatId).length) await this.usersRepository.addUser(addUserDto);

        const statsArr = await this.statsRepository.getClientStats(apiId);

        const createStatDto = new CreateStatDto();
        createStatDto.incomingMessagesCount = 0;
        createStatDto.apiIdClient = apiId;

        if (!(<any>statsArr).length) await this.statsRepository.addStats(createStatDto);

        await this.statsRepository.updateIncomingMessagesCountToSessionByApiId(apiId);

        this.logger.log(`incoming message successfully get}`);
    }

    async outgoingMessages(client: any, event: any) {
        this.logger.log(`Trying to get outgoing message}`);

        client.floodSleepThreshold = 300;
        client.setParseMode('html');

        const {className} = event.originalUpdate;
        if (className !== 'UpdateShortMessage') return;

        const {apiId} = client;
        const {message} = event.originalUpdate;
        const keywords = await this.sessionsRepository.getKeywordsFromSession(apiId);
        const parsedKeywords = await JSON.parse(keywords.keywords);

        const msgLowerCase = message.toLowerCase().trim();
        for (const [i, elem] of parsedKeywords.entries()) {
            const {
                keyword
            } = elem;

            if (!keyword) continue;

            const keywordsList = keyword.split(';');

            for (const item of keywordsList) {
                const keywordLowerCase = item.toLowerCase().trim();

                if (!(msgLowerCase.indexOf(keywordLowerCase) >= 0)) continue;

                parsedKeywords[i].count++
            }
        }
        const stringifyKeywords = JSON.stringify(parsedKeywords);

        if (keywords.keywords === stringifyKeywords) return;

        await this.sessionsRepository.updateKeywordsToSessionByApiId(stringifyKeywords, apiId);

        this.logger.log(`Outgoing message successfully get}`);
    }

    async statsSending(statsSendingDto: StatsSendingDto) {
        try {
            const {username, incomingMessagesCount, usersCount, averageMessagesCount, keywords} = statsSendingDto;
            this.logger.log(`Trying to send stats in table}`);

            const currentDate = new Date();
            currentDate.setHours(currentDate.getHours() - 3);
            const formattedDate = currentDate.toISOString().split('T')[0].replace(/-/g, '.');
            const activityToInsert: any[] = [];
            const countToInsert: any[] = [];

            keywords.forEach((item: any) => {
                activityToInsert.push({
                    userEnteredValue: {
                        stringValue: item.activity,
                    },
                });

                countToInsert.push({
                    userEnteredValue: {
                        numberValue: item.count,
                    },
                });
            });


            const sheetsClient = await googleSheets();

            const res = await sheetsClient.spreadsheets.values.get({
                spreadsheetId: SPREADSHEET_ID,
                range: 'A1:P',
            });
            const lastFilledCell = res.data.values.length

            // @ts-ignore
            await sheetsClient.spreadsheets.batchUpdate({
                    spreadsheetId: SPREADSHEET_ID,
                    requestBody: {
                        requests: [{
                            updateCells: {
                                range: {
                                    sheetId: SHEET_ID,
                                    startRowIndex: lastFilledCell,
                                    endRowIndex: lastFilledCell + 2,
                                    startColumnIndex: 0,
                                    endColumnIndex: 5 + keywords.length,
                                },
                                fields: 'userEnteredValue.numberValue',
                                rows: [
                                    {
                                        values: [
                                            {},
                                            {},
                                            {},
                                            {},
                                            {},
                                            ...activityToInsert,
                                        ],
                                    },
                                    {
                                        values: [
                                            {
                                                userEnteredValue: {
                                                    stringValue: formattedDate,
                                                },
                                            },
                                            {
                                                userEnteredValue: {
                                                    stringValue: username,
                                                },
                                            },
                                            {
                                                userEnteredValue: {
                                                    numberValue: incomingMessagesCount,
                                                },
                                            },
                                            {
                                                userEnteredValue: {
                                                    numberValue: usersCount,
                                                },
                                            },
                                            {
                                                userEnteredValue: {
                                                    numberValue: averageMessagesCount,
                                                },
                                            },
                                            ...countToInsert,
                                        ],
                                    },
                                ],
                            },
                        }
                        ],
                    },
                }
            );
            this.logger.log(`Stats successfully send in table}`);
        } catch
            (e) {
            console.log(e);
        }
    }
}
