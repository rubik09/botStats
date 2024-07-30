import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { DeleteResult, InsertResult, Repository } from 'typeorm';

import { CreateUserDto } from './dto/createUser.dto';
import { FindByApiIdAndTgIdDto } from './dto/findByApiIdAndTgId.dto';
import { User } from './entity/users.entity';
import { MetricLabels, MetricNames, UserMethodNames } from '../metrics/metrics.constant';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectMetric(MetricNames.DB_REQUEST_USERS_TOTAL) private dbRequestTotal: Counter<string>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findUserByApiIdAndTelegramId({ apiIdClient, telegramId }: FindByApiIdAndTgIdDto): Promise<User> {
    this.dbRequestTotal.inc({ [MetricLabels.METHOD]: UserMethodNames.FIND_USER_BY_API_ID_AND_TELEGRAM_ID });
    return await this.usersRepository
      .createQueryBuilder('users')
      .where('users.api_id_client = :apiIdClient AND users.telegram_id = :telegramId', {
        apiIdClient,
        telegramId,
      })
      .getOne();
  }

  async createUser(createUserDto: CreateUserDto): Promise<InsertResult> {
    this.dbRequestTotal.inc({ [MetricLabels.METHOD]: UserMethodNames.CREATE_USER });
    return await this.usersRepository.createQueryBuilder('users').insert().into(User).values(createUserDto).execute();
  }

  async getCountUsersByApiId(apiIdClient: number): Promise<number> {
    this.dbRequestTotal.inc({ [MetricLabels.METHOD]: UserMethodNames.GET_COUNT_USERS_BY_API_ID });
    return await this.usersRepository
      .createQueryBuilder('users')
      .where('users.api_id_client = :apiIdClient', { apiIdClient })
      .getCount();
  }

  async cleanTableByApiId(apiIdClient: number): Promise<DeleteResult> {
    this.dbRequestTotal.inc({ [MetricLabels.METHOD]: UserMethodNames.CLEAN_TABLE_BY_API_ID });
    return await this.usersRepository
      .createQueryBuilder('users')
      .delete()
      .from(User)
      .where('users.api_id_client = :apiIdClient', { apiIdClient })
      .execute();
  }
}
