import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';

import { DeleteStatsDto } from './dto/deleteStats.dto';
import { UpdateStatsDto } from './dto/updateStats.dto';
import { Stat } from './entity/stats.entity';

@Injectable()
export class StatsRepository {
  constructor(
    @InjectRepository(Stat)
    private readonly statsRepository: Repository<Stat>,
  ) {}

  async createStats(apiIdClient: number): Promise<Stat> {
    return await this.statsRepository.save({ apiIdClient });
  }

  async updateStatsByApiId(updateStatsDto: UpdateStatsDto, apiIdClient: number): Promise<UpdateResult> {
    return await this.statsRepository.update({ apiIdClient }, updateStatsDto);
  }

  async increaseIncomingMessagesCountToSessionByApiId(apiIdClient: number): Promise<UpdateResult> {
    return await this.statsRepository.increment({ apiIdClient }, 'incomingMessagesCount', 1);
  }

  async increaseOutgoingMessagesCountToSessionByApiId(apiIdClient: number): Promise<UpdateResult> {
    return await this.statsRepository.increment({ apiIdClient }, 'outgoingMessagesCount', 1);
  }

  async getStatsByApiId(apiIdClient: number): Promise<Stat> {
    return await this.statsRepository.findOne({ where: { apiIdClient } });
  }

  async getClientStatsByApiId(apiIdClient: number): Promise<Stat> {
    return await this.statsRepository.findOne({ where: { apiIdClient } });
  }

  async getCountStatsByApiId(apiIdClient: number): Promise<Stat> {
    return await this.statsRepository.findOne({
      where: { apiIdClient },
      select: ['usersCount'],
    });
  }

  async deleteStatsByApiId(deleteStatsDto: DeleteStatsDto): Promise<DeleteResult> {
    return await this.statsRepository.delete(deleteStatsDto);
  }
}
