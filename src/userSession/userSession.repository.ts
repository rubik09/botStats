import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository, UpdateResult, getManager } from 'typeorm';
import { PersonalInfo } from "../personalInfo/entity/personalInfo.entity";

import { UpdateApiInfoDto } from './dto/updateApiInfo.dto';
import { UpdateUserSessionInfoDto } from './dto/updateUserSession.dto';
import { UserSession, userSessionStatus } from './entity/userSession.entity';
import { CreatePersonalInfoDto } from '../personalInfo/dto/createPersonalInfo.dto';

@Injectable()
export class UserSessionRepository {
  constructor(
    @InjectRepository(UserSession)
    private readonly userSessionRepository: Repository<UserSession>,
    private readonly personalInfoRepository: Repository<PersonalInfo>,

  ) {}

  async getUserSessions(): Promise<UserSession[]> {
    return await this.userSessionRepository
      .createQueryBuilder('userSessions')
      .leftJoinAndSelect('userSessions.personalInfo', 'personalInfo')
      .getMany();
  }

  async createUserSession(
    telegramId: number,
    personalInfo: CreatePersonalInfoDto,
  ): Promise<UserSession> {
    return await this.userSessionRepository.save({ telegramId, personalInfo });
  }

  async getPersonalInfoByTelegramId(telegramId: number): Promise<UserSession> {
    return await this.userSessionRepository
      .createQueryBuilder('userSessions')
      .leftJoinAndSelect('userSessions.personalInfo', 'personalInfo')
      .where("telegram_id = :telegramId", { telegramId })
      .getOne();
  }

  async getPersonalInfoByApiId(apiId: number): Promise<UserSession> {
    return await this.userSessionRepository
      .createQueryBuilder()
      .select("personalInfo")
      .where("api_id = :apiId", { apiId })
      .getOne();
  }

  async getUserSessionById(id: number): Promise<UserSession> {
    return await this.userSessionRepository
      .createQueryBuilder()
      .where("id = :id", { id })
      .getOne();
  }

  async getUserSessionByTelegramId(telegramId: number): Promise<UserSession> {
    return await this.userSessionRepository
      .createQueryBuilder('userSessions')
      .where("userSessions.telegram_id = :telegramId", { telegramId })
      .getOne();
  }

  async getUserSessionByApiId(apiId: number): Promise<UserSession> {
    return await this.userSessionRepository
      .createQueryBuilder()
      .where("api_id = :apiId", { apiId })
      .getOne();
  }

  async updateUserSessionByTelegramId(
    telegramId: number,
    updateUserSessionInfoDto: UpdateUserSessionInfoDto,
  ): Promise<UpdateResult> {
    return await this.userSessionRepository
      .createQueryBuilder()
      .update(UserSession)
      .set(updateUserSessionInfoDto)
      .where("telegram_id = :telegramId", { telegramId })
      .execute();
  }

  async updateApiInfoByTelegramId(
    telegramId: number,
    updateApiInfoDto: UpdateApiInfoDto,
  ): Promise<UpdateResult> {
    return await this.userSessionRepository
      .createQueryBuilder()
      .update(UserSession).set(updateApiInfoDto)
      .where("telegram_id = :telegramId", { telegramId })
      .execute();
  }

  async getActiveUserSessions(): Promise<UserSession[]> {
    return await this.userSessionRepository
      .createQueryBuilder()
      .where("status = :status", { status: userSessionStatus.ACTIVE })
      .getMany();
  }
}
