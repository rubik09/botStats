import { HttpException, HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cron from 'node-cron';

import { UpdateStatsDto } from './dto/updateStats.dto';
import { Stats } from './entity/stats.entity';
import { StatsRepository } from './stats.repository';
import statsSending from './statsSending';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { UsersService } from '../users/users.service';
import { UpdateUserSessionInfoDto } from '../userSession/dto/updateUserSession.dto';
import { UserSessionService } from '../userSession/userSession.service';
import { cronTimezone, time } from '../utils/consts';
import zeroOutCounts from '../utils/zeroOutCounts';

@Injectable()
export class StatsService implements OnModuleInit {
  private readonly logger = new Logger(StatsService.name);
  constructor(
    private readonly statsRepository: StatsRepository,
    private readonly usersService: UsersService,
    private readonly userSessionService: UserSessionService,
    private readonly configService: ConfigService,
  ) {}

  async getStatsByApiId(apiId: Stats['apiIdClient']): Promise<Stats> {
    this.logger.log(`Trying to get stats by apiId: ${apiId}`);

    const stats = await this.statsRepository.getStatsByApiId(apiId);

    if (!stats) {
      this.logger.error(`stats with apiId: ${apiId} not found`);
    }

    this.logger.debug(`stats successfully get`);

    return stats;
  }

  async createStats(apiId: Stats['apiIdClient']): Promise<Stats> {
    this.logger.log(`Trying to create stats by apiId: ${apiId}`);

    const stats = await this.statsRepository.getStatsByApiId(apiId);

    if (stats) {
      this.logger.error(`stats with apiId: ${apiId} already exist`);
      throw new HttpException(`stats with apiId: ${apiId}  already exist`, HttpStatus.BAD_REQUEST);
    }

    const newStats = await this.statsRepository.createStats(apiId);

    this.logger.debug(`stats successfully created`);

    return newStats;
  }

  async updateStatsByApiId(updateStatsDto: UpdateStatsDto, apiId: Stats['apiIdClient']): Promise<number> {
    this.logger.log(`Trying to update stats by apiId: ${apiId}`);

    const userSession = await this.getStatsByApiId(apiId);

    if (!userSession) {
      this.logger.error(`stats with apiId: ${apiId} not found`);
      throw new HttpException(`stats with apiId: ${apiId} not found`, HttpStatus.NOT_FOUND);
    }

    const stats = await this.statsRepository.updateStatsByApiId(updateStatsDto, apiId);

    this.logger.debug(`stats successfully updated`);

    return stats;
  }

  async increaseIncomingMessagesCountToSessionByApiId(apiId: Stats['apiIdClient']): Promise<number> {
    this.logger.log(`Trying to increase incoming messages count by apiId: ${apiId}`);

    const userSession = this.getStatsByApiId(apiId);

    if (!userSession) {
      this.logger.error(`stats with apiId: ${apiId} not found`);
      throw new HttpException(`stats with apiId: ${apiId} not found`, HttpStatus.NOT_FOUND);
    }

    const stats = this.statsRepository.increaseIncomingMessagesCountToSessionByApiId(apiId);

    this.logger.debug(`incoming messages count successfully increased`);

    return stats;
  }

  async increaseOutgoingMessagesCountToSessionByApiId(apiId: Stats['apiIdClient']): Promise<number> {
    this.logger.log(`Trying to increase outgoing messages count by apiId: ${apiId}`);

    const userSession = await this.getStatsByApiId(apiId);

    if (!userSession) {
      this.logger.error(`stats with apiId: ${apiId} not found`);
      throw new HttpException(`stats with apiId: ${apiId} not found`, HttpStatus.NOT_FOUND);
    }

    const stats = await this.statsRepository.increaseOutgoingMessagesCountToSessionByApiId(apiId);

    this.logger.debug(`outgoing messages count successfully increased`);

    return stats;
  }

  async incomingMessages(clientInfoStr: string): Promise<void> {
    this.logger.log(`Trying to add incoming message to stats`);

    this.logger.log(`parsing clientInfoStr`);
    const clientInfoObj = JSON.parse(clientInfoStr);
    const { apiId, telegramId } = clientInfoObj;

    const createUserDto: CreateUserDto = <CreateUserDto>{
      telegramId,
      apiIdClient: apiId,
    };

    const user = await this.usersService.getUserByApiIdAndTelegramId(createUserDto);

    if (!user) await this.usersService.createUser(createUserDto);

    const stats = await this.getStatsByApiId(apiId);

    if (!stats) await this.createStats(apiId);

    await this.increaseIncomingMessagesCountToSessionByApiId(apiId);

    this.logger.debug(`incoming message successfully add to stats`);
  }

  async outgoingMessages(clientInfoStr: string) {
    this.logger.log(`Trying to add outgoing message to stats`);

    this.logger.log(`parsing clientInfoStr`);
    const clientInfoObj = JSON.parse(clientInfoStr);
    const { apiId, message } = clientInfoObj;

    const { keywords } = await this.userSessionService.getKeywordsFromUserSessionByApiId(apiId);
    const parsedKeywords = JSON.parse(keywords);
    const { personalInfo } = await this.userSessionService.getPersonalInfoByApiId(apiId);
    const { username } = personalInfo;
    const statsArr = await this.getStatsByApiId(apiId);

    if (!statsArr) await this.createStats(apiId);

    await this.increaseOutgoingMessagesCountToSessionByApiId(apiId);

    this.logger.debug({ username, apiId, date: new Date() });

    const msgLowerCase = message.toLowerCase().trim();
    for (const [i, elem] of parsedKeywords.entries()) {
      const { keyword } = elem;

      if (!keyword) continue;

      const keywordsList = keyword.split(';');

      for (const item of keywordsList) {
        const keywordLowerCase = item.toLowerCase().trim();

        this.logger.debug(`keyword: ${keyword} matched?`, msgLowerCase.indexOf(keywordLowerCase) >= 0);

        if (!(msgLowerCase.indexOf(keywordLowerCase) >= 0)) continue;

        parsedKeywords[i].count++;
      }
    }
    const stringifyKeywords = JSON.stringify(parsedKeywords);

    this.logger.debug({ arraySame: keywords === stringifyKeywords, message });

    if (keywords === stringifyKeywords) return;

    const updateUserSessionInfoDto: UpdateUserSessionInfoDto = <UpdateUserSessionInfoDto>{
      keywords: stringifyKeywords,
    };

    await this.userSessionService.updateUserSessionByApiId(apiId, updateUserSessionInfoDto);

    this.logger.debug(`outgoing message successfully add to stats`);
  }

  async PreSendCalculation(timeMessage: string) {
    this.logger.debug(`run PreSendCalculation`);

    const activeAccounts = await this.userSessionService.getActiveUserSessions();

    this.logger.debug(`active accounts arr: ${activeAccounts}`);

    for (const account of activeAccounts) {
      this.logger.debug(`run for cycle`);

      const { apiId } = account;
      const statsArr = await this.getStatsByApiId(apiId);
      if (!statsArr) await this.createStats(apiId);
      const allUsers = await this.usersService.getCountUsersByApiId(apiId);
      const { incomingMessagesCount, outgoingMessagesCount } = await this.getStatsByApiId(apiId);

      this.logger.debug(`run getKeywordsFromUserSessionByApiId`);

      const { keywords } = await this.userSessionService.getKeywordsFromUserSessionByApiId(apiId);

      this.logger.debug(`run JSON.parse(keywords)`);

      const parsedKeywords = JSON.parse(keywords);

      this.logger.debug(`JSON.parse(keywords) ended`);

      this.logger.debug(`run getPersonalInfoByApiId`);

      const { personalInfo } = await this.userSessionService.getPersonalInfoByApiId(apiId);

      this.logger.debug(`getPersonalInfoByApiId ended`);

      const { username } = personalInfo;
      let averageMessagesCount = incomingMessagesCount / allUsers;
      if (incomingMessagesCount < 1 || allUsers < 1) averageMessagesCount = 0;

      this.logger.debug({
        username: username,
        api_id: apiId,
        incomingMessages: incomingMessagesCount,
        outgoingMessages: outgoingMessagesCount,
      });

      await statsSending(
        username,
        incomingMessagesCount,
        allUsers,
        Number(averageMessagesCount.toFixed(2)),
        parsedKeywords,
        timeMessage,
      );

      const newArr = zeroOutCounts(parsedKeywords);
      const stringifyNewArr = JSON.stringify(newArr);

      const updateStatsDto: UpdateStatsDto = <UpdateStatsDto>{
        incomingMessagesCount: 0,
        outgoingMessagesCount: 0,
        usersCount: 0,
      };

      await this.updateStatsByApiId(updateStatsDto, apiId);

      await this.usersService.cleanTableByApiId(apiId);

      const updateUserSessionInfoDto: UpdateUserSessionInfoDto = <UpdateUserSessionInfoDto>{
        keywords: stringifyNewArr,
      };

      await this.userSessionService.updateUserSessionByApiId(apiId, updateUserSessionInfoDto);
    }
  }

  onModuleInit(): any {
    const { CRON_TIME_DAY, CRON_TIME_NIGHT } = this.configService.get('CRON');

    cron.schedule(
      CRON_TIME_DAY,
      async () => {
        await this.PreSendCalculation(time.DAY);
      },
      { scheduled: true, timezone: cronTimezone },
    );

    cron.schedule(
      CRON_TIME_NIGHT,
      async () => {
        await this.PreSendCalculation(time.NIGHT);
      },
      { scheduled: true, timezone: cronTimezone },
    );
  }
}
