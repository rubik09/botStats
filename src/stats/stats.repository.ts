import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DeleteStatsDto } from './dto/deleteStats.dto';
import { UpdateStatsDto } from './dto/updateStats.dto';
import { Stat } from './entity/stats.entity';

@Injectable()
export class StatsRepository {
  constructor(
    @InjectRepository(Stat)
    private readonly statsRepository: Repository<Stat>,
  ) {}

  async createStats(apiIdClient: Stat['apiIdClient']): Promise<Stat> {
    return await this.statsRepository.save({ apiIdClient });
  }

  async updateStatsByApiId(updateStatsDto: UpdateStatsDto, apiIdClient: Stat['apiIdClient']): Promise<number> {
    const { affected } = await this.statsRepository.update({ apiIdClient }, updateStatsDto);
    return affected;
  }

  async increaseIncomingMessagesCountToSessionByApiId(apiIdClient: Stat['apiIdClient']): Promise<number> {
    const { affected } = await this.statsRepository.increment({ apiIdClient }, 'incomingMessagesCount', 1);
    return affected;
  }

  async increaseOutgoingMessagesCountToSessionByApiId(apiIdClient: Stat['apiIdClient']): Promise<number> {
    const { affected } = await this.statsRepository.increment({ apiIdClient }, 'outgoingMessagesCount', 1);
    return affected;
  }

  async getStatsByApiId(apiIdClient: Stat['apiIdClient']): Promise<Stat> {
    return await this.statsRepository.findOne({ where: { apiIdClient } });
  }

  async getClientStatsByApiId(apiIdClient: Stat['apiIdClient']): Promise<Stat> {
    return await this.statsRepository.findOne({ where: { apiIdClient } });
  }

  async getCountStatsByApiId(apiIdClient: Stat['apiIdClient']): Promise<Stat> {
    return await this.statsRepository.findOne({
      where: { apiIdClient },
      select: ['usersCount'],
    });
  }

  async deleteStatsByApiId(deleteStatsDto: DeleteStatsDto): Promise<number> {
    const { affected } = await this.statsRepository.delete(deleteStatsDto);
    return affected;
  }
}
