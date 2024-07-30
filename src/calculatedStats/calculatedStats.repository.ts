import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { InsertResult, Repository } from 'typeorm';

import { CreateCalculatedStatsDto } from './dto/createCalculatedStats.dto';
import { GetStatsDto } from './dto/getStats.dto';
import { CalculatedStat } from './entity/calculatedStats.entity';
import { CalculatedStatMethodNames, MetricLabels, MetricNames } from '../metrics/metrics.constant';

@Injectable()
export class CalculatedStatsRepository {
  constructor(
    @InjectMetric(MetricNames.DB_REQUEST_CALCULATED_STATS_TOTAL) private dbRequestTotal: Counter<string>,
    @InjectRepository(CalculatedStat)
    private readonly calculatedStatRepository: Repository<CalculatedStat>,
  ) {}

  async getCalculatedStats({ limit, offset, username }: GetStatsDto): Promise<[CalculatedStat[], number]> {
    this.dbRequestTotal.inc({ [MetricLabels.METHOD]: CalculatedStatMethodNames.GET_CALCULATED_STATS });
    return await this.calculatedStatRepository
      .createQueryBuilder('calculatedStats')
      .limit(limit)
      .offset(offset)
      .orderBy('calculatedStats.created_at', 'DESC')
      .where(username ? 'calculatedStats.username ILIKE :username' : '1=1', { username })
      .getManyAndCount();
  }

  async createCalculatedStats(createCalculatedStatsDto: CreateCalculatedStatsDto): Promise<InsertResult> {
    this.dbRequestTotal.inc({ [MetricLabels.METHOD]: CalculatedStatMethodNames.CREATE_CALCULATED_STATS });
    return await this.calculatedStatRepository
      .createQueryBuilder('calculatedStats')
      .insert()
      .into(CalculatedStat)
      .values(createCalculatedStatsDto)
      .execute();
  }
}
