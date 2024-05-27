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

  async getCalculatedStats({ limit, offset, username }: GetStatsDto): Promise<[CalculatedStat[], number]> {
    return await this.calculatedStatRepository
      .createQueryBuilder('calculatedStats')
      .limit(limit)
      .offset(offset)
      .orderBy('calculatedStats.created_at', 'DESC')
      .where(username ? 'calculatedStats.username ILIKE :username' : '1=1', { username })
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
