import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';
import { DeleteResult, InsertResult, Repository } from 'typeorm';

import { CreateUserDto } from './dto/createUser.dto';
import { FindByApiIdAndTgIdDto } from './dto/findByApiIdAndTgId.dto';
import { User } from './entity/users.entity';
import { CounterMetricsConfig, HistogramMetricsConfig, Status, UserMethodNames } from '../metrics/metrics.constant';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectMetric(CounterMetricsConfig.DB_REQUEST_USERS_TOTAL.name) private dbRequestTotal: Counter<string>,
    @InjectMetric(HistogramMetricsConfig.DB_REQUEST_USERS_DURATION.name) private dbRequestDuration: Histogram<string>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findUserByApiIdAndTelegramId({ apiIdClient, telegramId }: FindByApiIdAndTgIdDto): Promise<User> {
    const timerRequest = this.dbRequestDuration.startTimer({
      method: UserMethodNames.FIND_USER_BY_API_ID_AND_TELEGRAM_ID,
    });
    this.dbRequestTotal.inc({ method: UserMethodNames.FIND_USER_BY_API_ID_AND_TELEGRAM_ID });

    try {
      const result = await this.usersRepository
        .createQueryBuilder('users')
        .where('users.api_id_client = :apiIdClient AND users.telegram_id = :telegramId', {
          apiIdClient,
          telegramId,
        })
        .getOne();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<InsertResult> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: UserMethodNames.CREATE_USER });
    this.dbRequestTotal.inc({ method: UserMethodNames.CREATE_USER });

    try {
      const result = await this.usersRepository
        .createQueryBuilder('users')
        .insert()
        .into(User)
        .values(createUserDto)
        .execute();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }

  async getCountUsersByApiId(apiIdClient: number): Promise<number> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: UserMethodNames.GET_COUNT_USERS_BY_API_ID });
    this.dbRequestTotal.inc({ method: UserMethodNames.GET_COUNT_USERS_BY_API_ID });

    try {
      const result = await this.usersRepository
        .createQueryBuilder('users')
        .where('users.api_id_client = :apiIdClient', { apiIdClient })
        .getCount();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }

  async cleanTableByApiId(apiIdClient: number): Promise<DeleteResult> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: UserMethodNames.CLEAN_TABLE_BY_API_ID });
    this.dbRequestTotal.inc({ method: UserMethodNames.CLEAN_TABLE_BY_API_ID });

    try {
      const result = await this.usersRepository
        .createQueryBuilder('users')
        .delete()
        .from(User)
        .where('users.api_id_client = :apiIdClient', { apiIdClient })
        .execute();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }
}
