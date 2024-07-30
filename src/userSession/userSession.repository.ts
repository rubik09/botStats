import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { QueryRunner, Repository, UpdateResult } from 'typeorm';

import { CreateUserSessionDto } from './dto/createUserSession.dto';
import { UpdateApiInfoDto } from './dto/updateApiInfo.dto';
import { UpdateUserSessionInfoDto } from './dto/updateUserSession.dto';
import { UserSession, userSessionStatus } from './entity/userSession.entity';
import { MetricLabels, MetricNames, UserSessionMethodNames } from '../metrics/metrics.constant';
import { CreatePersonalInfoDto } from '../personalInfo/dto/createPersonalInfo.dto';
import { PersonalInfo } from '../personalInfo/entity/personalInfo.entity';

@Injectable()
export class UserSessionRepository {
  constructor(
    @InjectMetric(MetricNames.DB_REQUEST_USER_SESSION_TOTAL) private dbRequestTotal: Counter<string>,
    @InjectRepository(UserSession)
    private readonly userSessionRepository: Repository<UserSession>,
  ) {}

  async getUserSessions(): Promise<[UserSession[], number]> {
    this.dbRequestTotal.inc({ [MetricLabels.METHOD]: UserSessionMethodNames.GET_USER_SESSIONS });
    return await this.userSessionRepository
      .createQueryBuilder('userSessions')
      .leftJoinAndSelect('userSessions.personalInfo', 'personalInfo')
      .getManyAndCount();
  }

  async getPersonalInfoByTelegramId(telegramId: number): Promise<UserSession> {
    this.dbRequestTotal.inc({ [MetricLabels.METHOD]: UserSessionMethodNames.GET_PERSONAL_INFO_BY_TELEGRAM_ID });
    return await this.userSessionRepository
      .createQueryBuilder('userSessions')
      .leftJoinAndSelect('userSessions.personalInfo', 'personalInfo')
      .where('telegram_id = :telegramId', { telegramId })
      .getOne();
  }

  async getPersonalInfoByApiId(apiId: number): Promise<UserSession> {
    this.dbRequestTotal.inc({ [MetricLabels.METHOD]: UserSessionMethodNames.GET_PERSONAL_INFO_BY_API_ID });
    return await this.userSessionRepository
      .createQueryBuilder('userSessions')
      .leftJoinAndSelect('userSessions.personalInfo', 'personalInfo')
      .where('api_id = :apiId', { apiId })
      .getOne();
  }

  async getUserSessionById(id: number): Promise<UserSession> {
    this.dbRequestTotal.inc({ [MetricLabels.METHOD]: UserSessionMethodNames.GET_USER_SESSION_BY_ID });
    return await this.userSessionRepository.createQueryBuilder('userSessions').where('id = :id', { id }).getOne();
  }

  async getUserSessionByTelegramId(telegramId: number): Promise<UserSession> {
    this.dbRequestTotal.inc({ [MetricLabels.METHOD]: UserSessionMethodNames.GET_USER_SESSION_BY_TELEGRAM_ID });
    return await this.userSessionRepository
      .createQueryBuilder('userSessions')
      .where('userSessions.telegram_id = :telegramId', { telegramId })
      .getOne();
  }

  async getUserSessionByApiId(apiId: number): Promise<UserSession> {
    this.dbRequestTotal.inc({ [MetricLabels.METHOD]: UserSessionMethodNames.GET_USER_SESSION_BY_API_ID });
    return await this.userSessionRepository
      .createQueryBuilder('userSessions')
      .where('api_id = :apiId', { apiId })
      .getOne();
  }

  async updateUserSessionByTelegramId(
    telegramId: number,
    updateUserSessionInfoDto: UpdateUserSessionInfoDto,
  ): Promise<UpdateResult> {
    this.dbRequestTotal.inc({ [MetricLabels.METHOD]: UserSessionMethodNames.UPDATE_USER_SESSION_BY_TELEGRAM_ID });
    return await this.userSessionRepository
      .createQueryBuilder('userSessions')
      .update(UserSession)
      .set(updateUserSessionInfoDto)
      .where('telegram_id = :telegramId', { telegramId })
      .execute();
  }

  async updateApiInfoByTelegramId(telegramId: number, updateApiInfoDto: UpdateApiInfoDto): Promise<UpdateResult> {
    this.dbRequestTotal.inc({ [MetricLabels.METHOD]: UserSessionMethodNames.UPDATE_API_INFO_BY_TELEGRAM_ID });
    return await this.userSessionRepository
      .createQueryBuilder('userSessions')
      .update(UserSession)
      .set(updateApiInfoDto)
      .where('telegram_id = :telegramId', { telegramId })
      .execute();
  }

  async getActiveUserSessions(): Promise<[UserSession[], number]> {
    this.dbRequestTotal.inc({ [MetricLabels.METHOD]: UserSessionMethodNames.GET_ACTIVE_USER_SESSIONS });
    return await this.userSessionRepository
      .createQueryBuilder('userSessions')
      .where('status = :status', { status: userSessionStatus.ACTIVE })
      .getManyAndCount();
  }

  async createUserSessionTransaction(
    queryRunner: QueryRunner,
    createPersonalInfoDto: CreatePersonalInfoDto,
    telegramId: number,
  ): Promise<UserSession> {
    this.dbRequestTotal.inc({ [MetricLabels.METHOD]: UserSessionMethodNames.CREATE_USER_SESSION_TRANSACTION });
    const { id } = await queryRunner.manager.save(PersonalInfo, createPersonalInfoDto);
    const createUserSessionDto: CreateUserSessionDto = {
      telegramId,
      personalInfo: {
        id,
      },
    };

    return await queryRunner.manager.save(UserSession, createUserSessionDto);
  }
}
