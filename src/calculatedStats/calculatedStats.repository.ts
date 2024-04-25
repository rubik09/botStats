import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
}
