import { HttpException, HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CreateTelegramConnectionDto } from './dto/createTelegramConnect.dto';
import { BotAlertService } from '../botAlert/botAlert.service';
import { CreateKeywordsDto } from '../keywords/dto/createKeywords.dto';
import { KeywordsService } from '../keywords/keywords.service';
import { UpdateApiInfoDto } from '../userSession/dto/updateApiInfo.dto';
import { UpdateUserSessionInfoDto } from '../userSession/dto/updateUserSession.dto';
import { userSessionStatus } from '../userSession/entity/userSession.entity';
import { UserSessionService } from '../userSession/userSession.service';
import { setupSteps } from '../utils/consts';
import { createClient } from '../utils/createClient';
import emitterSubject from '../utils/emitter';
import { IClients, IFirstStep, IPromises, ISecondStep, IThirdStep } from '../utils/interfaces';
import generatePromise from '../utils/TelegramPromiseGeneration';
import { TSetupSteps } from '../utils/types';

const clients: IClients = {};
const promises: IPromises = {};

@Injectable()
export class TelegramConnectService implements OnModuleInit {
  private connectionStepFunctions: TSetupSteps;
  private readonly logger = new Logger(TelegramConnectService.name);
  private readonly chatId: number;

  constructor(
    private userSessionService: UserSessionService,
    private keywordsService: KeywordsService,
    private bot: BotAlertService,
    private configService: ConfigService,
  ) {
    this.chatId = this.configService.get('CHAT_ID_ALERT');
  }

  async firstConnectionStep({ apiId, apiHash, telegramId, username, phoneNumber }: IFirstStep) {
    this.logger.debug(`Run first connection step for ${username}`);

    this.logger.debug(
      `First connection step: apiId: ${apiId}, apiHash: ${apiHash}, telegramId: ${telegramId}, ${username}`,
    );

    this.logger.log(`First connection step: creating client for ${username}`);

    const client = await createClient({ logSession: '', apiId, apiHash });

    if (!client) {
      this.bot.sendMessage(
        this.chatId,
        `Problem  client for creating ${username} with apiId: ${apiId}, apiHash ${apiHash}`,
      );
      this.logger.error(`First connection step: error on client.start for ${username}`);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    clients[telegramId] = client;

    this.logger.debug(`First connection step: client connection for ${username}`);

    promises[telegramId] = generatePromise();

    this.logger.debug(`First connection step: generating promises and wait code with password for ${username}`);

    try {
      await client.start({
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
          console.log(e);
        },
      });

      const updateApiInfoDto: UpdateApiInfoDto = {
        apiId,
        apiHash,
      };

      await this.userSessionService.updateApiInfoByTelegramId(telegramId, updateApiInfoDto);

      this.logger.debug(`First connection step: successfully ended for ${username}`);
    } catch (e) {
      this.logger.error(`${e} for ${username}`);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async secondConnectionStep({ accountPassword, code, telegramId, username }: ISecondStep) {
    this.logger.debug(`Run second connection step for ${username}`);

    this.logger.debug(
      `Second connection step: accountPassword: ${accountPassword}, code: ${code}, telegramId: ${telegramId}, ${username}`,
    );

    await promises[telegramId].resolve({
      accountPassword: accountPassword,
      phoneCode: code,
    });
    await promises[telegramId].resolve({
      accountPassword: accountPassword,
      phoneCode: code,
    });

    this.logger.debug(`Second connection step: resolving code and password promises for ${username}`);

    const client = clients[telegramId];
    const logSession = String(client.session.save());

    this.logger.debug(`Second connection step: save log session for ${username}`);

    const updateUserSessionInfoDto: UpdateUserSessionInfoDto = {
      logSession,
      status: userSessionStatus.ACTIVE,
    };

    await this.userSessionService.updateUserSessionByTelegramId(telegramId, updateUserSessionInfoDto);

    this.logger.debug(`Second connection step: successfully ended for ${username}`);
  }

  async thirdConnectionStep({ activity, keyword, telegramId, username }: IThirdStep) {
    this.logger.debug(`Run third connection step for ${username}`);

    this.logger.debug(
      `Third connection step: keywords: ${activity}: ${keyword}, telegramId: ${telegramId}, ${username}`,
    );

    const userSession = await this.userSessionService.getUserSessionByTelegramId(telegramId);

    const createKeywordsDto: CreateKeywordsDto = {
      activity,
      keyword,
      userSession,
    };

    await this.keywordsService.createNewKeyword(userSession.id, createKeywordsDto);
    const client = clients[telegramId];

    this.logger.debug(`Third connection step: run emmiter for ${username}`);

    emitterSubject.next({ eventName: 'newClient', data: client });

    this.logger.log(`Third connection step: successfully ended for ${username}`);
  }

  onModuleInit() {
    this.connectionStepFunctions = {
      [setupSteps.FIRST_STEP]: async ({
        apiId,
        apiHash,
        telegramId,
        username,
        phoneNumber,
      }: CreateTelegramConnectionDto) =>
        this.firstConnectionStep({
          apiId,
          apiHash,
          telegramId,
          username,
          phoneNumber,
        }),
      [setupSteps.SECOND_STEP]: async ({ accountPassword, code, telegramId, username }: CreateTelegramConnectionDto) =>
        this.secondConnectionStep({
          accountPassword,
          code,
          telegramId,
          username,
        }),
      [setupSteps.THIRD_STEP]: async ({ keyword, activity, telegramId, username }: CreateTelegramConnectionDto) =>
        this.thirdConnectionStep({
          keyword,
          activity,
          telegramId,
          username,
        }),
    };
  }

  async connectToTelegram(createTelegramConnectionDto: CreateTelegramConnectionDto) {
    const { setupStep, telegramId } = createTelegramConnectionDto;
    const { personalInfo } = await this.userSessionService.getPersonalInfoByTelegramId(telegramId);
    const { username, phoneNumber } = personalInfo;

    createTelegramConnectionDto.username = username;
    createTelegramConnectionDto.phoneNumber = phoneNumber;

    this.logger.log(`Main connectToTelegram function: run step ${setupStep}`);

    await this.connectionStepFunctions[setupStep as setupSteps](createTelegramConnectionDto);
  }
}
