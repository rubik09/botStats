import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';
import { QueryRunner, Repository, UpdateResult } from 'typeorm';

import { CreateUserSessionDto } from './dto/createUserSession.dto';
import { UpdateApiInfoDto } from './dto/updateApiInfo.dto';
import { UpdateUserSessionInfoDto } from './dto/updateUserSession.dto';
import { UserSession, userSessionStatus } from './entity/userSession.entity';
import { MetricNames, Status, UserSessionMethodNames } from '../metrics/metrics.constant';
import { CreatePersonalInfoDto } from '../personalInfo/dto/createPersonalInfo.dto';
import { PersonalInfo } from '../personalInfo/entity/personalInfo.entity';

@Injectable()
export class UserSessionRepository {
  constructor(
    @InjectMetric(MetricNames.DB_REQUEST_USER_SESSION_TOTAL) private dbRequestTotal: Counter<string>,
    @InjectMetric(MetricNames.DB_REQUEST_USER_SESSION_DURATION) private dbRequestDuration: Histogram<string>,
    @InjectRepository(UserSession)
    private readonly userSessionRepository: Repository<UserSession>,
  ) {}

  async getUserSessions(): Promise<[UserSession[], number]> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: UserSessionMethodNames.GET_USER_SESSIONS });
    this.dbRequestTotal.inc({ method: UserSessionMethodNames.GET_USER_SESSIONS });

    try {
      const result = await this.userSessionRepository
        .createQueryBuilder('userSessions')
        .leftJoinAndSelect('userSessions.personalInfo', 'personalInfo')
        .getManyAndCount();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }

  async getPersonalInfoByTelegramId(telegramId: number): Promise<UserSession> {
    const timerRequest = this.dbRequestDuration.startTimer({
      method: UserSessionMethodNames.GET_PERSONAL_INFO_BY_TELEGRAM_ID,
    });
    this.dbRequestTotal.inc({ method: UserSessionMethodNames.GET_PERSONAL_INFO_BY_TELEGRAM_ID });

    try {
      const result = await this.userSessionRepository
        .createQueryBuilder('userSessions')
        .leftJoinAndSelect('userSessions.personalInfo', 'personalInfo')
        .where('telegram_id = :telegramId', { telegramId })
        .getOne();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }

  async getPersonalInfoByApiId(apiId: number): Promise<UserSession> {
    const timerRequest = this.dbRequestDuration.startTimer({
      method: UserSessionMethodNames.GET_PERSONAL_INFO_BY_API_ID,
    });
    this.dbRequestTotal.inc({ method: UserSessionMethodNames.GET_PERSONAL_INFO_BY_API_ID });

    try {
      const result = await this.userSessionRepository
        .createQueryBuilder('userSessions')
        .leftJoinAndSelect('userSessions.personalInfo', 'personalInfo')
        .where('api_id = :apiId', { apiId })
        .getOne();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }

  async getUserSessionById(id: number): Promise<UserSession> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: UserSessionMethodNames.GET_USER_SESSION_BY_ID });
    this.dbRequestTotal.inc({ method: UserSessionMethodNames.GET_USER_SESSION_BY_ID });

    try {
      const result = await this.userSessionRepository
        .createQueryBuilder('userSessions')
        .where('id = :id', { id })
        .getOne();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }

  async getUserSessionByTelegramId(telegramId: number): Promise<UserSession> {
    const timerRequest = this.dbRequestDuration.startTimer({
      method: UserSessionMethodNames.GET_USER_SESSION_BY_TELEGRAM_ID,
    });
    this.dbRequestTotal.inc({ method: UserSessionMethodNames.GET_USER_SESSION_BY_TELEGRAM_ID });

    try {
      const result = await this.userSessionRepository
        .createQueryBuilder('userSessions')
        .where('userSessions.telegram_id = :telegramId', { telegramId })
        .getOne();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }

  async getUserSessionByApiId(apiId: number): Promise<UserSession> {
    const timerRequest = this.dbRequestDuration.startTimer({
      method: UserSessionMethodNames.GET_USER_SESSION_BY_API_ID,
    });
    this.dbRequestTotal.inc({ method: UserSessionMethodNames.GET_USER_SESSION_BY_API_ID });

    try {
      const result = await this.userSessionRepository
        .createQueryBuilder('userSessions')
        .where('api_id = :apiId', { apiId })
        .getOne();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }

  async updateUserSessionByTelegramId(
    telegramId: number,
    updateUserSessionInfoDto: UpdateUserSessionInfoDto,
  ): Promise<UpdateResult> {
    const timerRequest = this.dbRequestDuration.startTimer({
      method: UserSessionMethodNames.UPDATE_USER_SESSION_BY_TELEGRAM_ID,
    });
    this.dbRequestTotal.inc({ method: UserSessionMethodNames.UPDATE_USER_SESSION_BY_TELEGRAM_ID });

    try {
      const result = await this.userSessionRepository
        .createQueryBuilder('userSessions')
        .update(UserSession)
        .set(updateUserSessionInfoDto)
        .where('telegram_id = :telegramId', { telegramId })
        .execute();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }

  async updateApiInfoByTelegramId(telegramId: number, updateApiInfoDto: UpdateApiInfoDto): Promise<UpdateResult> {
    const timerRequest = this.dbRequestDuration.startTimer({
      method: UserSessionMethodNames.UPDATE_API_INFO_BY_TELEGRAM_ID,
    });
    this.dbRequestTotal.inc({ method: UserSessionMethodNames.UPDATE_API_INFO_BY_TELEGRAM_ID });

    try {
      const result = await this.userSessionRepository
        .createQueryBuilder('userSessions')
        .update(UserSession)
        .set(updateApiInfoDto)
        .where('telegram_id = :telegramId', { telegramId })
        .execute();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }

  async getActiveUserSessions(): Promise<[UserSession[], number]> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: UserSessionMethodNames.GET_ACTIVE_USER_SESSIONS });
    this.dbRequestTotal.inc({ method: UserSessionMethodNames.GET_ACTIVE_USER_SESSIONS });

    try {
      const result = await this.userSessionRepository
        .createQueryBuilder('userSessions')
        .where('status = :status', { status: userSessionStatus.ACTIVE })
        .getManyAndCount();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }

  async createUserSessionTransaction(
    queryRunner: QueryRunner,
    createPersonalInfoDto: CreatePersonalInfoDto,
    telegramId: number,
  ): Promise<UserSession> {
    const timerRequest = this.dbRequestDuration.startTimer({
      method: UserSessionMethodNames.CREATE_USER_SESSION_TRANSACTION,
    });
    this.dbRequestTotal.inc({ method: UserSessionMethodNames.CREATE_USER_SESSION_TRANSACTION });

    try {
      const { id } = await queryRunner.manager.save(PersonalInfo, createPersonalInfoDto);
      const createUserSessionDto: CreateUserSessionDto = {
        telegramId,
        personalInfo: {
          id,
        },
      };

      const result = await queryRunner.manager.save(UserSession, createUserSessionDto);
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }
}
