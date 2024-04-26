import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { UpdateStatsDto } from './dto/updateStats.dto';
import { Stat } from './entity/stats.entity';
import { StatsRepository } from './stats.repository';
import statsSending from './statsSending';
import { KeywordsService } from '../keywords/keywords.service';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { UsersService } from '../users/users.service';
import { UserSessionService } from '../userSession/userSession.service';
import { combineKeywords } from '../utils/combineKeywords';
import { cronTimeDay, cronTimeNight, cronTimezone, time } from '../utils/consts';

@Injectable()
export class StatsService {
  private readonly logger = new Logger(StatsService.name);

  constructor(
    private readonly statsRepository: StatsRepository,
    private readonly usersService: UsersService,
    private readonly userSessionService: UserSessionService,
    private readonly keywordsService: KeywordsService,
  ) {}

  async getStatsByApiId(apiId: Stat['apiIdClient']): Promise<Stat> {
    this.logger.log(`Trying to get stats by apiId: ${apiId}`);

    const stats = await this.statsRepository.getStatsByApiId(apiId);

    if (!stats) {
      this.logger.error(`stats with apiId: ${apiId} not found`);
    }

    this.logger.debug(`stats successfully get by apiId: ${apiId}`);

    return stats;
  }

  async createStats(apiId: Stat['apiIdClient']) {
    this.logger.log(`Trying to create stats by apiId: ${apiId}`);

    const stats = await this.statsRepository.getStatsByApiId(apiId);

    if (stats) {
      this.logger.error(`stats with apiId: ${apiId} already exist`);
      throw new HttpException(`stats with apiId: ${apiId}  already exist`, HttpStatus.BAD_REQUEST);
    }

    const { raw } = await this.statsRepository.createStats(apiId);

    this.logger.debug(`stats successfully created with id: ${raw[0].id}`);
  }

  async updateStatsByApiId(updateStatsDto: UpdateStatsDto, apiId: Stat['apiIdClient']) {
    this.logger.log(`Trying to update stats by apiId: ${apiId}`);

    const userSession = await this.getStatsByApiId(apiId);

    if (!userSession) {
      this.logger.error(`stats with apiId: ${apiId} not found`);
      throw new HttpException(`stats with apiId: ${apiId} not found`, HttpStatus.NOT_FOUND);
    }

    const { affected } = await this.statsRepository.updateStatsByApiId(updateStatsDto, apiId);

    this.logger.debug(`${affected} stats successfully updated by apiId: ${apiId}`);
  }

  async increaseIncomingMessagesCountToSessionByApiId(apiId: Stat['apiIdClient']) {
    this.logger.log(`Trying to increase incoming messages count by apiId: ${apiId}`);

    const userSession = await this.getStatsByApiId(apiId);

    if (!userSession) {
      this.logger.error(`stats with apiId: ${apiId} not found`);
      throw new HttpException(`stats with apiId: ${apiId} not found`, HttpStatus.NOT_FOUND);
    }

    const { affected } = await this.statsRepository.increaseIncomingMessagesCountToSessionByApiId(apiId);

    this.logger.debug(`${affected} incoming messages count successfully increased by apiId: ${apiId}`);
  }

  async increaseOutgoingMessagesCountToSessionByApiId(apiId: Stat['apiIdClient']) {
    this.logger.log(`Trying to increase outgoing messages count by apiId: ${apiId}`);

    const userSession = await this.getStatsByApiId(apiId);

    if (!userSession) {
      this.logger.error(`stats with apiId: ${apiId} not found`);
      throw new HttpException(`stats with apiId: ${apiId} not found`, HttpStatus.NOT_FOUND);
    }

    const { affected } = await this.statsRepository.increaseOutgoingMessagesCountToSessionByApiId(apiId);

    this.logger.debug(`${affected} outgoing messages count successfully increased by apiId: ${apiId}`);
  }

  async incomingMessages(clientInfoStr: string) {
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

    this.logger.debug(`incoming message successfully add to stats by apiId: ${apiId}`);
  }

  async outgoingMessages(clientInfoStr: string) {
    this.logger.log(`Trying to add outgoing message to stats`);

    this.logger.log(`parsing clientInfoStr`);
    const clientInfoObj = JSON.parse(clientInfoStr);
    const { apiId, message } = clientInfoObj;

    const { personalInfo, id } = await this.userSessionService.getPersonalInfoByApiId(apiId);
    const { username } = personalInfo;
    const statsArr = await this.getStatsByApiId(apiId);

    if (!statsArr) await this.createStats(apiId);

    await this.increaseOutgoingMessagesCountToSessionByApiId(apiId);

    this.logger.debug({ username, apiId, date: new Date() });

    const keywordIncludes = await this.keywordsService.findKeywordByUserSessionId(message, id);

    if (keywordIncludes) await this.keywordsService.increaseKeywordsCountById(keywordIncludes.id);

    this.logger.debug(`outgoing message successfully add to stats`);
  }

  async PreSendCalculation(timeMessage: string) {
    const activeAccounts = await this.userSessionService.getActiveUserSessions();

    for (const account of activeAccounts) {
      const { apiId, id } = account;
      const statsArr = await this.getStatsByApiId(apiId);
      if (!statsArr) await this.createStats(apiId);
      const allUsers = await this.usersService.getCountUsersByApiId(apiId);
      const { incomingMessagesCount, outgoingMessagesCount } = await this.getStatsByApiId(apiId);
      const keywords = await this.keywordsService.getKeywordsByUserSessionId(id);
      const { personalInfo } = await this.userSessionService.getPersonalInfoByApiId(apiId);
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
        combineKeywords(keywords),
        timeMessage,
      );

      const updateStatsDto: UpdateStatsDto = <UpdateStatsDto>{
        incomingMessagesCount: 0,
        outgoingMessagesCount: 0,
        usersCount: 0,
      };

      await this.updateStatsByApiId(updateStatsDto, apiId);

      await this.usersService.cleanTableByApiId(apiId);

      await this.keywordsService.resetCountByUserSessionId(id);
    }
  }

  @Cron(cronTimeDay, { timeZone: cronTimezone })
  async handleCronDay() {
    await this.PreSendCalculation(time.DAY);
  }

  @Cron(cronTimeNight, { timeZone: cronTimezone })
  async handleCronNight() {
    await this.PreSendCalculation(time.NIGHT);
  }
}
