import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, InsertResult, Repository, UpdateResult } from 'typeorm';

import { UpdateApiInfoDto } from './dto/updateApiInfo.dto';
import { UpdateUserSessionInfoDto } from './dto/updateUserSession.dto';
import { UserSession, userSessionStatus } from './entity/userSession.entity';
import { CreatePersonalInfoDto } from '../personalInfo/dto/createPersonalInfo.dto';
import { PersonalInfo } from '../personalInfo/entity/personalInfo.entity';

@Injectable()
export class UserSessionRepository {
  constructor(
    @InjectRepository(UserSession)
    @InjectRepository(PersonalInfo)
    private readonly userSessionRepository: Repository<UserSession>,
    private readonly dataSource: DataSource,
  ) {}

  async getUserSessions(): Promise<[UserSession[], number]> {
    return await this.userSessionRepository
      .createQueryBuilder('userSessions')
      .leftJoinAndSelect('userSessions.personalInfo', 'personalInfo')
      .getManyAndCount();
  }

  async createUserSession(telegramId: number, personalInfo: CreatePersonalInfoDto): Promise<InsertResult> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { identifiers } = await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(PersonalInfo)
        .values(personalInfo)
        .execute();

      const insertedPersonalInfoId = identifiers[0]?.id;

      const personalInfoEntity = await queryRunner.manager
        .createQueryBuilder(PersonalInfo, 'personalInfo')
        .where('personalInfo.id = :id', { id: insertedPersonalInfoId })
        .getOne();

      const userSession = queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(UserSession)
        .values({
          telegramId,
          personalInfo: personalInfoEntity,
        })
        .execute();

      await queryRunner.commitTransaction();
      return userSession;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getPersonalInfoByTelegramId(telegramId: number): Promise<UserSession> {
    return await this.userSessionRepository
      .createQueryBuilder('userSessions')
      .leftJoinAndSelect('userSessions.personalInfo', 'personalInfo')
      .where('telegram_id = :telegramId', { telegramId })
      .getOne();
  }

  async getPersonalInfoByApiId(apiId: number): Promise<UserSession> {
    return await this.userSessionRepository
      .createQueryBuilder('userSessions')
      .leftJoinAndSelect('userSessions.personalInfo', 'personalInfo')
      .where('api_id = :apiId', { apiId })
      .getOne();
  }

  async getUserSessionById(id: number): Promise<UserSession> {
    return await this.userSessionRepository.createQueryBuilder('userSessions').where('id = :id', { id }).getOne();
  }

  async getUserSessionByTelegramId(telegramId: number): Promise<UserSession> {
    return await this.userSessionRepository
      .createQueryBuilder('userSessions')
      .where('userSessions.telegram_id = :telegramId', { telegramId })
      .getOne();
  }

  async getUserSessionByApiId(apiId: number): Promise<UserSession> {
    return await this.userSessionRepository
      .createQueryBuilder('userSessions')
      .where('api_id = :apiId', { apiId })
      .getOne();
  }

  async updateUserSessionByTelegramId(
    telegramId: number,
    updateUserSessionInfoDto: UpdateUserSessionInfoDto,
  ): Promise<UpdateResult> {
    return await this.userSessionRepository
      .createQueryBuilder('userSessions')
      .update(UserSession)
      .set(updateUserSessionInfoDto)
      .where('telegram_id = :telegramId', { telegramId })
      .execute();
  }

  async updateApiInfoByTelegramId(telegramId: number, updateApiInfoDto: UpdateApiInfoDto): Promise<UpdateResult> {
    return await this.userSessionRepository
      .createQueryBuilder('userSessions')
      .update(UserSession)
      .set(updateApiInfoDto)
      .where('telegram_id = :telegramId', { telegramId })
      .execute();
  }

  async getActiveUserSessions(): Promise<[UserSession[], number]> {
    return await this.userSessionRepository
      .createQueryBuilder('userSessions')
      .where('status = :status', { status: userSessionStatus.ACTIVE })
      .getManyAndCount();
  }
}
