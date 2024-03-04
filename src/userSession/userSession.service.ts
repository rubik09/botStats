import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { UserSessionRepository } from "./userSession.repository";
import { UserSession } from "./entity/userSession.entity";
import { UpdateUserSessionInfoDto } from "./dto/updateUserSession.dto";
import { UpdateApiInfoDto } from "./dto/updateApiInfo.dto";
import { CreatePersonalInfoDto } from "../personalInfo/dto/createPersonalInfo.dto";

@Injectable()
export class UserSessionService {
  private readonly logger = new Logger(UserSessionService.name);

  constructor(private userSessionRepository: UserSessionRepository) {}

  async getPersonalInfoByTelegramId(
    telegramId: UserSession["telegramId"],
  ): Promise<UserSession> {
    this.logger.log(`Trying to get personal info by telegramId: ${telegramId}`);

    const userSession =
      this.userSessionRepository.getUserSessionByTelegramId(telegramId);

    if (!userSession) {
      this.logger.error(
        `personal info with telegramId: ${telegramId} not found`,
      );
      throw new HttpException(
        `personal info with telegramId: ${telegramId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const personalInfo =
      this.userSessionRepository.getPersonalInfoByTelegramId(telegramId);

    this.logger.debug(`personal info successfully get`);

    return personalInfo;
  }

  async getPersonalInfoByApiId(
    apiId: UserSession["apiId"],
  ): Promise<UserSession> {
    this.logger.log(`Trying to get personal info by apiId: ${apiId}`);

    const userSession =
      await this.userSessionRepository.getUserSessionByApiId(apiId);

    if (!userSession) {
      this.logger.error(`personal info with apiId: ${apiId} not found`);
      throw new HttpException(
        `personal info with apiId: ${apiId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const personalInfo =
      await this.userSessionRepository.getPersonalInfoByApiId(apiId);

    this.logger.debug(`personal info successfully get`);

    return personalInfo;
  }

  async getKeywordsFromUserSessionByApiId(
    apiId: UserSession["apiId"],
  ): Promise<UserSession> {
    this.logger.log(`Trying to get keywords by apiId: ${apiId}`);

    const userSession =
      await this.userSessionRepository.getUserSessionByApiId(apiId);

    if (!userSession) {
      this.logger.error(`keywords with apiId: ${apiId} not found`);
      throw new HttpException(
        `keywords with apiId: ${apiId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const keywords =
      await this.userSessionRepository.getKeywordsFromUserSessionByApiId(apiId);

    this.logger.debug(`keywords successfully get`);

    return keywords;
  }

  async getActiveUserSessions(): Promise<UserSession[]> {
    this.logger.log(`Trying to get Active User Sessions`);

    const activeSessions = this.userSessionRepository.getActiveUserSessions();

    this.logger.debug(`Active User Sessions successfully get`);

    return activeSessions;
  }

  async getAllUserSessions(): Promise<UserSession[]> {
    this.logger.log(`Trying to get all User Sessions`);

    const activeSessions = this.userSessionRepository.getUserSessions();

    this.logger.debug(`Active User Sessions successfully get`);

    return activeSessions;
  }

  async updateUserSessionById(
    id: UserSession["id"],
    updateUserSessionInfoDto: UpdateUserSessionInfoDto,
  ): Promise<number> {
    this.logger.log(`Trying to update user session by id: ${id}`);

    const userSession = this.userSessionRepository.getUserSessionById(id);

    if (!userSession) {
      this.logger.error(`user session with id: ${id} not found`);
      throw new HttpException(
        `user session with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedUserSession = this.userSessionRepository.updateUserSessionById(
      id,
      updateUserSessionInfoDto,
    );

    this.logger.debug(`user session successfully updated`);

    return updatedUserSession;
  }

  async updateUserSessionByTelegramId(
    telegramId: UserSession["telegramId"],
    updateUserSessionInfoDto: UpdateUserSessionInfoDto,
  ): Promise<number> {
    this.logger.log(
      `Trying to update user session by telegramId: ${telegramId}`,
    );

    const userSession =
      this.userSessionRepository.getUserSessionByTelegramId(telegramId);

    if (!userSession) {
      this.logger.error(
        `user session with telegramId: ${telegramId} not found`,
      );
      throw new HttpException(
        `user session with telegramId: ${telegramId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedUserSession =
      this.userSessionRepository.updateUserSessionByTelegramId(
        telegramId,
        updateUserSessionInfoDto,
      );

    this.logger.debug(`user session successfully updated`);

    return updatedUserSession;
  }

  async updateUserSessionByApiId(
    apiId: UserSession["apiId"],
    updateUserSessionInfoDto: UpdateUserSessionInfoDto,
  ): Promise<number> {
    this.logger.log(`Trying to update user session by apiId: ${apiId}`);

    const userSession =
      await this.userSessionRepository.getUserSessionByApiId(apiId);

    if (!userSession) {
      this.logger.error(`user session with apiId: ${apiId} not found`);
      throw new HttpException(
        `user session with apiId: ${apiId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedUserSession =
      await this.userSessionRepository.updateUserSessionByApiId(
        apiId,
        updateUserSessionInfoDto,
      );

    this.logger.debug(`user session successfully updated`);

    return updatedUserSession;
  }

  async updateApiInfoByTelegramId(
    telegramId: UserSession["telegramId"],
    updateApiInfoDto: UpdateApiInfoDto,
  ): Promise<number> {
    this.logger.log(`Trying to update api info by telegramId: ${telegramId}`);

    const userSession =
      this.userSessionRepository.getUserSessionByTelegramId(telegramId);

    if (!userSession) {
      this.logger.error(
        `user session with telegramId: ${telegramId} not found`,
      );
      throw new HttpException(
        `user session with telegramId: ${telegramId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedUserSession =
      this.userSessionRepository.updateApiInfoByTelegramId(
        telegramId,
        updateApiInfoDto,
      );

    this.logger.debug(`api info successfully updated`);

    return updatedUserSession;
  }

  async createUserSession(
    telegramId: UserSession["telegramId"],
    personalInfo: CreatePersonalInfoDto,
  ): Promise<UserSession> {
    this.logger.log(`Trying to create user session`);

    const userSession =
      await this.userSessionRepository.getUserSessionByTelegramId(telegramId);

    if (userSession) {
      this.logger.error(`session with telegramId: ${telegramId} already exist`);
      throw new HttpException(
        `session with telegramId: ${telegramId} already exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newUserSession = await this.userSessionRepository.createUserSession(
      telegramId,
      personalInfo,
    );

    this.logger.debug(`admin successfully created`);

    return newUserSession;
  }
}
