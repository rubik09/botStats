import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { InsertResult, Repository, UpdateResult } from 'typeorm';

import { UpdateStatsDto } from './dto/updateStats.dto';
import { Stat } from './entity/stats.entity';
import { MetricLabels, MetricNames, StatsMethodNames } from '../metrics/metrics.constant';

@Injectable()
export class StatsRepository {
  constructor(
    @InjectMetric(MetricNames.DB_REQUEST_STATS_TOTAL) private dbRequestTotal: Counter<string>,
    @InjectRepository(Stat)
    private readonly statsRepository: Repository<Stat>,
  ) {}

  async createStats(apiIdClient: number): Promise<InsertResult> {
    this.dbRequestTotal.inc({ [MetricLabels.METHOD]: StatsMethodNames.CREATE_STATS });
    return await this.statsRepository.createQueryBuilder('stats').insert().into(Stat).values({ apiIdClient }).execute();
  }

  async updateStatsByApiId(updateStatsDto: UpdateStatsDto, apiIdClient: number): Promise<UpdateResult> {
    this.dbRequestTotal.inc({ [MetricLabels.METHOD]: StatsMethodNames.UPDATE_STATS_BY_API_ID });
    return await this.statsRepository
      .createQueryBuilder('stats')
      .update(Stat)
      .set(updateStatsDto)
      .where('stats.api_id_client = :apiIdClient', { apiIdClient })
      .execute();
  }

  async increaseIncomingMessagesCountToSessionByApiId(apiIdClient: number): Promise<UpdateResult> {
    this.dbRequestTotal.inc({ [MetricLabels.METHOD]: StatsMethodNames.INCREASE_INCOMING_MESSAGES_COUNT });
    return await this.statsRepository
      .createQueryBuilder('stats')
      .update(Stat)
      .set({ incomingMessagesCount: () => 'incomingMessagesCount + 1' })
      .where('stats.api_id_client = :apiIdClient', { apiIdClient })
      .execute();
  }

  async increaseOutgoingMessagesCountToSessionByApiId(apiIdClient: number): Promise<UpdateResult> {
    this.dbRequestTotal.inc({ [MetricLabels.METHOD]: StatsMethodNames.INCREASE_OUTGOING_MESSAGES_COUNT });
    return await this.statsRepository
      .createQueryBuilder('stats')
      .update(Stat)
      .set({ outgoingMessagesCount: () => 'outgoingMessagesCount + 1' })
      .where('stats.api_id_client = :apiIdClient', { apiIdClient })
      .execute();
  }

  async getStatsByApiId(apiIdClient: number): Promise<Stat> {
    this.dbRequestTotal.inc({ [MetricLabels.METHOD]: StatsMethodNames.GET_STATS_BY_API_ID });
    return await this.statsRepository
      .createQueryBuilder('stats')
      .where('stats.api_id_client = :apiIdClient', { apiIdClient })
      .getOne();
  }
}
