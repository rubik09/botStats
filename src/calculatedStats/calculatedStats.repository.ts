import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';
import { InsertResult, Repository } from 'typeorm';

import { CreateCalculatedStatsDto } from './dto/createCalculatedStats.dto';
import { GetStatsDto } from './dto/getStats.dto';
import { CalculatedStat } from './entity/calculatedStats.entity';
import { CalculatedStatMethodNames, MetricNames, Status } from '../metrics/metrics.constant';

@Injectable()
export class CalculatedStatsRepository {
  constructor(
    @InjectMetric(MetricNames.DB_REQUEST_CALCULATED_STATS_TOTAL) private dbRequestTotal: Counter<string>,
    @InjectMetric(MetricNames.DB_REQUEST_CALCULATED_STATS_DURATION)
    private readonly dbRequestDuration: Histogram<string>,
    @InjectRepository(CalculatedStat)
    private readonly calculatedStatRepository: Repository<CalculatedStat>,
  ) {}

  async getCalculatedStats({ limit, offset, username }: GetStatsDto): Promise<[CalculatedStat[], number]> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: CalculatedStatMethodNames.GET_CALCULATED_STATS });
    this.dbRequestTotal.inc({ method: CalculatedStatMethodNames.GET_CALCULATED_STATS });

    try {
      const result = await this.calculatedStatRepository
        .createQueryBuilder('calculatedStats')
        .limit(limit)
        .offset(offset)
        .orderBy('calculatedStats.created_at', 'DESC')
        .where(username ? 'calculatedStats.username ILIKE :username' : '1=1', { username })
        .getManyAndCount();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }

  async createCalculatedStats(createCalculatedStatsDto: CreateCalculatedStatsDto): Promise<InsertResult> {
    const timerRequest = this.dbRequestDuration.startTimer({
      method: CalculatedStatMethodNames.CREATE_CALCULATED_STATS,
    });
    this.dbRequestTotal.inc({ method: CalculatedStatMethodNames.CREATE_CALCULATED_STATS });

    try {
      const result = await this.calculatedStatRepository
        .createQueryBuilder('calculatedStats')
        .insert()
        .into(CalculatedStat)
        .values(createCalculatedStatsDto)
        .execute();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }
}
