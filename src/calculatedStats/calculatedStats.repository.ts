import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';

import { CreateCalculatedStatsDto } from './dto/createCalculatedStats.dto';
import { CalculatedStat } from './entity/calculatedStats.entity';

@Injectable()
export class CalculatedStatsRepository {
  constructor(
    @InjectRepository(CalculatedStat)
    private readonly calculatedStatRepository: Repository<CalculatedStat>,
  ) {}

  async getAllCalculatedStats(): Promise<[CalculatedStat[], number]> {
    return await this.calculatedStatRepository.createQueryBuilder('calculatedStats').getManyAndCount();
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
