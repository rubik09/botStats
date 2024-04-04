import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {DeleteResult, Repository, UpdateResult} from 'typeorm';

import { DeleteUserSessionDto } from './dto/deleteUserSession.dto';
import { UpdateApiInfoDto } from './dto/updateApiInfo.dto';
import { UpdateUserSessionInfoDto } from './dto/updateUserSession.dto';
import { UserSession, userSessionStatus } from './entity/userSession.entity';
import { CreatePersonalInfoDto } from '../personalInfo/dto/createPersonalInfo.dto';

@Injectable()
export class UserSessionRepository {
  constructor(
    @InjectRepository(UserSession)
    private readonly userSessionRepository: Repository<UserSession>,
  ) {}

  async getStatusById(id: number): Promise<UserSession> {
    return await this.userSessionRepository.findOne({
      where: { id },
      select: ['id', 'status'],
    });
  }

  async getUserSessions(): Promise<UserSession[]> {
    return await this.userSessionRepository.find();
  }

  async createUserSession(
    telegramId: number,
    personalInfo: CreatePersonalInfoDto,
  ): Promise<UserSession> {
    return await this.userSessionRepository.save({ telegramId, personalInfo });
  }

  async getKeywordsFromUserSessionByApiId(apiId: number): Promise<UserSession> {
    return await this.userSessionRepository.findOne({
      where: { apiId },
    });
  }

  async getMainInfoById(id: number): Promise<UserSession> {
    return this.userSessionRepository.findOne({
      where: { id },
      select: ['id', 'apiId', 'apiHash', 'logSession', 'telegramId'],
    });
  }

  async getPersonalInfoByTelegramId(telegramId: number): Promise<UserSession> {
    return await this.userSessionRepository.findOne({
      where: { telegramId },
      select: ['personalInfo'],
    });
  }

  async getPersonalInfoByApiId(apiId: number): Promise<UserSession> {
    return await this.userSessionRepository.findOne({
      where: { apiId },
      select: ['personalInfo'],
    });
  }

  async deleteUserSessionById(deleteUserSessionDto: DeleteUserSessionDto): Promise<DeleteResult> {
    return await this.userSessionRepository.delete(deleteUserSessionDto);
  }

  async deleteUserSessionByTelegramId(telegramId: number): Promise<DeleteResult> {
    return await this.userSessionRepository.delete({
      telegramId,
    });
  }

  async getUserSessionById(id: number): Promise<UserSession> {
    return await this.userSessionRepository.findOne({ where: { id } });
  }

  async getUserSessionByTelegramId(telegramId: number): Promise<UserSession> {
    return await this.userSessionRepository.findOne({ where: { telegramId } });
  }

  async getUserSessionByApiId(apiId: number): Promise<UserSession> {
    return await this.userSessionRepository.findOne({ where: { apiId } });
  }

  async updateUserSessionById(
    id: number,
    updateUserSessionInfoDto: UpdateUserSessionInfoDto,
  ): Promise<UpdateResult> {
    return await this.userSessionRepository.update({ id }, updateUserSessionInfoDto);
  }

  async updateUserSessionByTelegramId(
    telegramId: number,
    updateUserSessionInfoDto: UpdateUserSessionInfoDto,
  ): Promise<UpdateResult> {
    return await this.userSessionRepository.update({ telegramId }, updateUserSessionInfoDto);
  }

  async updateUserSessionByApiId(
    apiId: number,
    updateUserSessionInfoDto: UpdateUserSessionInfoDto,
  ): Promise<UpdateResult> {
    return await this.userSessionRepository.update({ apiId }, updateUserSessionInfoDto);
  }

  async updateApiInfoByTelegramId(
    telegramId: number,
    updateApiInfoDto: UpdateApiInfoDto,
  ): Promise<UpdateResult> {
    return await this.userSessionRepository.update({ telegramId }, updateApiInfoDto);
  }

  async getActiveUserSessions(): Promise<UserSession[]> {
    return await this.userSessionRepository.find({
      where: { status: userSessionStatus.ACTIVE },
    });
  }
}
