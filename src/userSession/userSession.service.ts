import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';

import { CreateUserSessionDto } from './dto/createUserSession.dto';
import { UpdateApiInfoDto } from './dto/updateApiInfo.dto';
import { UpdateUserSessionInfoDto } from './dto/updateUserSession.dto';
import { UserSession } from './entity/userSession.entity';
import { UserSessionRepository } from './userSession.repository';
import { CreatePersonalInfoDto } from '../personalInfo/dto/createPersonalInfo.dto';
import { PersonalInfoService } from '../personalInfo/personalInfo.service';

@Injectable()
export class UserSessionService {
  private readonly logger = new Logger(UserSessionService.name);

  constructor(
    private userSessionRepository: UserSessionRepository,
    private personalInfoService: PersonalInfoService,
    private readonly dataSource: DataSource,
  ) {}

  async getPersonalInfoByTelegramId(telegramId: UserSession['telegramId']): Promise<UserSession> {
    this.logger.log(`Trying to get personal info by telegramId: ${telegramId}`);

    const userSession = this.userSessionRepository.getUserSessionByTelegramId(telegramId);

    if (!userSession) {
      this.logger.error(`personal info with telegramId: ${telegramId} not found`);
      throw new HttpException(`personal info with telegramId: ${telegramId} not found`, HttpStatus.NOT_FOUND);
    }

    const personalInfo = this.userSessionRepository.getPersonalInfoByTelegramId(telegramId);

    this.logger.debug(`personal info successfully get by telegramId: ${telegramId}`);

    return personalInfo;
  }

  async getUserSessionByTelegramId(telegramId: UserSession['telegramId']): Promise<UserSession> {
    this.logger.log(`Trying to get UserSession by telegramId: ${telegramId}`);

    const userSession = this.userSessionRepository.getUserSessionByTelegramId(telegramId);

    if (!userSession) {
      this.logger.error(`UserSession with telegramId: ${telegramId} not found`);
      throw new HttpException(`UserSession with telegramId: ${telegramId} not found`, HttpStatus.NOT_FOUND);
    }

    this.logger.debug(`UserSession successfully get by telegramId: ${telegramId}`);

    return userSession;
  }

  async getPersonalInfoByApiId(apiId: UserSession['apiId']): Promise<UserSession> {
    this.logger.log(`Trying to get personal info by apiId: ${apiId}`);

    const userSession = await this.userSessionRepository.getUserSessionByApiId(apiId);

    if (!userSession) {
      this.logger.error(`personal info with apiId: ${apiId} not found`);
      throw new HttpException(`personal info with apiId: ${apiId} not found`, HttpStatus.NOT_FOUND);
    }

    const personalInfo = await this.userSessionRepository.getPersonalInfoByApiId(apiId);

    this.logger.debug(`personal info successfully get by apiId: ${apiId}`);

    return personalInfo;
  }

  async getActiveUserSessions(): Promise<UserSession[]> {
    this.logger.log(`Trying to get Active User Sessions`);

    const [activeSessions, count] = await this.userSessionRepository.getActiveUserSessions();

    this.logger.debug(`${count} Active User Sessions successfully get`);

    return activeSessions;
  }

  async getAllUserSessions(): Promise<UserSession[]> {
    this.logger.log(`Trying to get all User Sessions`);

    const [activeSessions, count] = await this.userSessionRepository.getUserSessions();

    this.logger.debug(`${count} All User Sessions successfully get `);

    return activeSessions;
  }

  async getUserSessionById(id: UserSession['id']): Promise<UserSession> {
    this.logger.log(`Trying to get User Sessions by id: ${id}`);

    const userSession = await this.userSessionRepository.getUserSessionById(id);

    if (!userSession) {
      this.logger.error(`session with id: ${id} not exist`);
      throw new HttpException(`session with id: ${id} not exist`, HttpStatus.BAD_REQUEST);
    }

    this.logger.debug(`User Sessions successfully get by id: ${id}`);

    return userSession;
  }

  async updateUserSessionByTelegramId(
    telegramId: UserSession['telegramId'],
    updateUserSessionInfoDto: UpdateUserSessionInfoDto,
  ) {
    this.logger.log(`Trying to update user session by telegramId: ${telegramId}`);

    const userSession = this.userSessionRepository.getUserSessionByTelegramId(telegramId);

    if (!userSession) {
      this.logger.error(`user session with telegramId: ${telegramId} not found`);
      throw new HttpException(`user session with telegramId: ${telegramId} not found`, HttpStatus.NOT_FOUND);
    }

    const { affected } = await this.userSessionRepository.updateUserSessionByTelegramId(
      telegramId,
      updateUserSessionInfoDto,
    );

    this.logger.debug(`${affected} user session successfully updated by telegramId: ${telegramId}`);
  }

  async updateApiInfoByTelegramId(telegramId: UserSession['telegramId'], updateApiInfoDto: UpdateApiInfoDto) {
    this.logger.log(`Trying to update api info by telegramId: ${telegramId}`);

    const userSession = this.userSessionRepository.getUserSessionByTelegramId(telegramId);

    if (!userSession) {
      this.logger.error(`user session with telegramId: ${telegramId} not found`);
      throw new HttpException(`user session with telegramId: ${telegramId} not found`, HttpStatus.NOT_FOUND);
    }

    const { affected } = await this.userSessionRepository.updateApiInfoByTelegramId(telegramId, updateApiInfoDto);

    this.logger.debug(`${affected} api info successfully updated by telegramId: ${telegramId}`);
  }

  async createUserSessionTransaction(
    queryRunner: QueryRunner,
    createUserSessionDto: CreateUserSessionDto,
  ): Promise<UserSession> {
    const { telegramId } = createUserSessionDto;
    this.logger.log(`Trying to create personal info with transaction by telegramId: ${telegramId}`);

    const userSession = await this.userSessionRepository.getUserSessionByTelegramId(telegramId);

    if (userSession) {
      this.logger.error(`userSession info with telegramId: ${telegramId}`);
      throw new HttpException(`userSession info with telegramId: ${telegramId}`, HttpStatus.BAD_REQUEST);
    }

    const newUserSession = await this.userSessionRepository.createUserSessionTransaction(
      queryRunner,
      createUserSessionDto,
    );

    this.logger.debug(`userSession successfully created with id: ${newUserSession.id}`);

    return newUserSession;
  }

  async createUserSessionAndPersonalInfoTransaction(
    telegramId: UserSession['telegramId'],
    createPersonalInfoDto: CreatePersonalInfoDto,
  ) {
    this.logger.log(`Trying to create user session by telegramId: ${telegramId} and personal info with transaction`);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { id } = await this.personalInfoService.createPersonalInfoTransaction(queryRunner, createPersonalInfoDto);

      const createUserSessionDto: CreateUserSessionDto = {
        telegramId,
        personalInfo: {
          id,
        },
      };

      await this.createUserSessionTransaction(queryRunner, createUserSessionDto);

      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(`error on transaction: ${err}`);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    this.logger.debug(`user session successfully created with id: ${telegramId}`);
  }
}
