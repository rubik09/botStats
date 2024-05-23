import { Injectable, Logger } from '@nestjs/common';

import { CalculatedStatsRepository } from './calculatedStats.repository';
import { CreateCalculatedStatsDto } from './dto/createCalculatedStats.dto';
import { GetStatsDto } from './dto/getStats.dto';
import { CalculatedStat } from './entity/calculatedStats.entity';

@Injectable()
export class CalculatedStatsService {
  private readonly logger = new Logger(CalculatedStatsService.name);
  constructor(private calculatedStatsRepository: CalculatedStatsRepository) {}

  async getCalculatedStats(
    username: CalculatedStat['username'],
    page: number,
    limit: number,
  ): Promise<[CalculatedStat[], number]> {
    this.logger.log(`Trying to get all calculated stats by username: ${username}`);

    const offset = (page - 1) * limit;
    const getStatsDto: GetStatsDto = {
      username,
      limit,
      offset,
    };
    const calculatedStats = await this.calculatedStatsRepository.getCalculatedStats(getStatsDto);

    this.logger.debug(`${calculatedStats[1]} calculated stat successfully get by username: ${username}`);

    return calculatedStats;
  }

  async createCalculatedStats(createCalculatedStatsDto: CreateCalculatedStatsDto) {
    const { username } = createCalculatedStatsDto;

    this.logger.log(`Trying to create calculated stats for: ${username}`);

    const { raw } = await this.calculatedStatsRepository.createCalculatedStats(createCalculatedStatsDto);

    this.logger.debug(`calculated stats successfully created with id: ${raw[0].id}`);
  }
}
