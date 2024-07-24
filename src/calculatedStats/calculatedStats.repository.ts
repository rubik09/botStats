import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';

import { CreateCalculatedStatsDto } from './dto/createCalculatedStats.dto';
import { GetStatsDto } from './dto/getStats.dto';
import { CalculatedStat } from './entity/calculatedStats.entity';

@Injectable()
export class CalculatedStatsRepository {
  constructor(
    @InjectRepository(CalculatedStat)
    private readonly calculatedStatRepository: Repository<CalculatedStat>,
  ) {}

  async getCalculatedStats({ limit, offset, username, from, to }: GetStatsDto): Promise<[CalculatedStat[], number]> {
    return await this.calculatedStatRepository
      .createQueryBuilder('calculatedStats')
      .limit(limit)
      .offset(offset)
      .orderBy('calculatedStats.created_at', 'DESC')
      .where((qb) => {
        if(username) {
          qb.where('calculatedStats.username ILIKE :username', { username });
        }
        if (from) {
          qb.andWhere('calculatedStats.created_at >= :from', { from });
        }
        if (to) {
          qb.andWhere('calculatedStats.created_at <= :to', { to });
        }
      })
      .getManyAndCount();
  }

  async createCalculatedStats(createCalculatedStatsDto: CreateCalculatedStatsDto): Promise<InsertResult> {
    return await this.calculatedStatRepository
      .createQueryBuilder('calculatedStats')
      .insert()
      .into(CalculatedStat)
      .values(createCalculatedStatsDto)
      .execute();
  }
}
