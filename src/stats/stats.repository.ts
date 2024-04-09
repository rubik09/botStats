import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, InsertResult } from 'typeorm';

import { UpdateStatsDto } from './dto/updateStats.dto';
import { Stat } from './entity/stats.entity';

@Injectable()
export class StatsRepository {
  constructor(
    @InjectRepository(Stat)
    private readonly statsRepository: Repository<Stat>,
  ) {}

  async createStats(apiIdClient: number): Promise<InsertResult> {
    return await this.statsRepository
      .createQueryBuilder('stats')
      .insert()
      .into(Stat)
      .values({ apiIdClient })
      .execute();
  }

  async updateStatsByApiId(updateStatsDto: UpdateStatsDto, apiIdClient: number): Promise<UpdateResult> {
    return await this.statsRepository
      .createQueryBuilder('stats')
      .update(Stat)
      .set(updateStatsDto)
      .where("stats.api_id_client = :apiIdClient", { apiIdClient })
      .execute();
  }

  async increaseIncomingMessagesCountToSessionByApiId(apiIdClient: number): Promise<UpdateResult> {
    return await this.statsRepository
      .createQueryBuilder('stats')
      .update(Stat)
      .set({ incomingMessagesCount: () => "incomingMessagesCount + 1" })
      .where("stats.api_id_client = :apiIdClient", { apiIdClient })
      .execute();
  }

  async increaseOutgoingMessagesCountToSessionByApiId(apiIdClient: number): Promise<UpdateResult> {
    return await this.statsRepository
      .createQueryBuilder('stats')
      .update(Stat)
      .set({ outgoingMessagesCount: () => "outgoingMessagesCount + 1" })
      .where("stats.api_id_client = :apiIdClient", { apiIdClient })
      .execute();
  }

  async getStatsByApiId(apiIdClient: number): Promise<Stat> {
    return await this.statsRepository
      .createQueryBuilder('stats')
      .where("stats.api_id_client = :apiIdClient", { apiIdClient })
      .getOne();
  }
}
