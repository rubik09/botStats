import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';
import { InsertResult, Repository, UpdateResult } from 'typeorm';

import { UpdateStatsDto } from './dto/updateStats.dto';
import { Stat } from './entity/stats.entity';
import { MetricNames, StatsMethodNames, Status } from '../metrics/metrics.constant';

@Injectable()
export class StatsRepository {
  constructor(
    @InjectMetric(MetricNames.DB_REQUEST_STATS_TOTAL) private dbRequestTotal: Counter<string>,
    @InjectMetric(MetricNames.DB_REQUEST_STATS_DURATION) private dbRequestDuration: Histogram<string>,
    @InjectRepository(Stat)
    private readonly statsRepository: Repository<Stat>,
  ) {}

  async createStats(apiIdClient: number): Promise<InsertResult> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: StatsMethodNames.CREATE_STATS });
    this.dbRequestTotal.inc({ method: StatsMethodNames.CREATE_STATS });

    try {
      const result = await this.statsRepository
        .createQueryBuilder('stats')
        .insert()
        .into(Stat)
        .values({ apiIdClient })
        .execute();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }

  async updateStatsByApiId(updateStatsDto: UpdateStatsDto, apiIdClient: number): Promise<UpdateResult> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: StatsMethodNames.UPDATE_STATS_BY_API_ID });
    this.dbRequestTotal.inc({ method: StatsMethodNames.UPDATE_STATS_BY_API_ID });

    try {
      const result = await this.statsRepository
        .createQueryBuilder('stats')
        .update(Stat)
        .set(updateStatsDto)
        .where('stats.api_id_client = :apiIdClient', { apiIdClient })
        .execute();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }

  async increaseIncomingMessagesCountToSessionByApiId(apiIdClient: number): Promise<UpdateResult> {
    const timerRequest = this.dbRequestDuration.startTimer({
      method: StatsMethodNames.INCREASE_INCOMING_MESSAGES_COUNT,
    });
    this.dbRequestTotal.inc({ method: StatsMethodNames.INCREASE_INCOMING_MESSAGES_COUNT });

    try {
      const result = await this.statsRepository
        .createQueryBuilder('stats')
        .update(Stat)
        .set({ incomingMessagesCount: () => 'incomingMessagesCount + 1' })
        .where('stats.api_id_client = :apiIdClient', { apiIdClient })
        .execute();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }

  async increaseOutgoingMessagesCountToSessionByApiId(apiIdClient: number): Promise<UpdateResult> {
    const timerRequest = this.dbRequestDuration.startTimer({
      method: StatsMethodNames.INCREASE_OUTGOING_MESSAGES_COUNT,
    });
    this.dbRequestTotal.inc({ method: StatsMethodNames.INCREASE_OUTGOING_MESSAGES_COUNT });

    try {
      const result = await this.statsRepository
        .createQueryBuilder('stats')
        .update(Stat)
        .set({ outgoingMessagesCount: () => 'outgoingMessagesCount + 1' })
        .where('stats.api_id_client = :apiIdClient', { apiIdClient })
        .execute();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }

  async getStatsByApiId(apiIdClient: number): Promise<Stat> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: StatsMethodNames.GET_STATS_BY_API_ID });
    this.dbRequestTotal.inc({ method: StatsMethodNames.GET_STATS_BY_API_ID });

    try {
      const result = await this.statsRepository
        .createQueryBuilder('stats')
        .where('stats.api_id_client = :apiIdClient', { apiIdClient })
        .getOne();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }
}
