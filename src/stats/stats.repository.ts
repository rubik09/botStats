import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { InsertResult, Repository, UpdateResult } from 'typeorm';

import { UpdateStatsDto } from './dto/updateStats.dto';
import { Stat } from './entity/stats.entity';
import { MetricNames } from '../metrics/metrics.constant';

@Injectable()
export class StatsRepository {
  constructor(
    @InjectMetric(MetricNames.DB_REQUEST_STATS_TOTAL) private dbRequestTotal: Counter<string>,
    @InjectRepository(Stat)
    private readonly statsRepository: Repository<Stat>,
  ) {}

  async createStats(apiIdClient: number): Promise<InsertResult> {
    this.dbRequestTotal.inc({ method: 'createStats' });
    return await this.statsRepository.createQueryBuilder('stats').insert().into(Stat).values({ apiIdClient }).execute();
  }

  async updateStatsByApiId(updateStatsDto: UpdateStatsDto, apiIdClient: number): Promise<UpdateResult> {
    this.dbRequestTotal.inc({ method: 'updateStatsByApiId' });
    return await this.statsRepository
      .createQueryBuilder('stats')
      .update(Stat)
      .set(updateStatsDto)
      .where('stats.api_id_client = :apiIdClient', { apiIdClient })
      .execute();
  }

  async increaseIncomingMessagesCountToSessionByApiId(apiIdClient: number): Promise<UpdateResult> {
    this.dbRequestTotal.inc({ method: 'increaseIncomingMessagesCountToSessionByApiId' });
    return await this.statsRepository
      .createQueryBuilder('stats')
      .update(Stat)
      .set({ incomingMessagesCount: () => 'incomingMessagesCount + 1' })
      .where('stats.api_id_client = :apiIdClient', { apiIdClient })
      .execute();
  }

  async increaseOutgoingMessagesCountToSessionByApiId(apiIdClient: number): Promise<UpdateResult> {
    this.dbRequestTotal.inc({ method: 'increaseOutgoingMessagesCountToSessionByApiId' });
    return await this.statsRepository
      .createQueryBuilder('stats')
      .update(Stat)
      .set({ outgoingMessagesCount: () => 'outgoingMessagesCount + 1' })
      .where('stats.api_id_client = :apiIdClient', { apiIdClient })
      .execute();
  }

  async getStatsByApiId(apiIdClient: number): Promise<Stat> {
    this.dbRequestTotal.inc({ method: 'getStatsByApiId' });
    return await this.statsRepository
      .createQueryBuilder('stats')
      .where('stats.api_id_client = :apiIdClient', { apiIdClient })
      .getOne();
  }
}
