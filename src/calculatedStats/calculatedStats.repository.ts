import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';

import { CreateCalculatedStatsDto } from './dto/createCalculatedStats.dto';
import { GetStatsByUsernameDto } from './dto/getStatsByUsername.dto';
import { CalculatedStat } from './entity/calculatedStats.entity';

@Injectable()
export class CalculatedStatsRepository {
  constructor(
    @InjectRepository(CalculatedStat)
    private readonly calculatedStatRepository: Repository<CalculatedStat>,
  ) {}

  async getAllCalculatedStats(offset: number, limit: number): Promise<[CalculatedStat[], number]> {
    return await this.calculatedStatRepository
      .createQueryBuilder('calculatedStats')
      .orderBy('calculatedStats.created_at', 'DESC')
      .limit(limit)
      .offset(offset)
      .getManyAndCount();
  }

  async getCalculatedStatsByUsername({
    limit,
    offset,
    username,
  }: GetStatsByUsernameDto): Promise<[CalculatedStat[], number]> {
    return await this.calculatedStatRepository
      .createQueryBuilder('calculatedStats')
      .orderBy('calculatedStats.created_at', 'DESC')
      .limit(limit)
      .offset(offset)
      .where('calculatedStats.username = :username', { username })
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
