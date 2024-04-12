import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository, UpdateResult } from 'typeorm';

import { UpdateApiInfoDto } from './dto/updateApiInfo.dto';
import { UpdateUserSessionInfoDto } from './dto/updateUserSession.dto';
import { UserSession, userSessionStatus } from './entity/userSession.entity';
import { CreatePersonalInfoDto } from '../personalInfo/dto/createPersonalInfo.dto';
import { PersonalInfoRepository } from '../personalInfo/personalInfo.repository';

@Injectable()
export class UserSessionRepository {
  constructor(
    @InjectRepository(UserSession)
    private readonly userSessionRepository: Repository<UserSession>,
    private readonly personalInfoRepository: PersonalInfoRepository,
  ) {}

  async getUserSessions(): Promise<[UserSession[], number]> {
    return await this.userSessionRepository
      .createQueryBuilder('userSessions')
      .leftJoinAndSelect('userSessions.personalInfo', 'personalInfo')
      .getManyAndCount();
  }

  async createUserSession(telegramId: number, personalInfo: CreatePersonalInfoDto): Promise<InsertResult> {
    const { identifiers } = await this.personalInfoRepository.createPersonalInfo(personalInfo);
    const insertedPersonalInfoId = identifiers[0]?.id;
    const personalInfoEntity = await this.personalInfoRepository.getByUserId(insertedPersonalInfoId);

    return this.userSessionRepository
      .createQueryBuilder('userSessions')
      .insert()
      .into(UserSession)
      .values({
        telegramId,
        personalInfo: personalInfoEntity,
      })
      .execute();
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
