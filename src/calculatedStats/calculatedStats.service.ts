import { Injectable, Logger } from '@nestjs/common';

import { CalculatedStatsRepository } from './calculatedStats.repository';
import { CreateCalculatedStatsDto } from './dto/createCalculatedStats.dto';
import { GetStatsByUsernameDto } from './dto/getStatsByUsername.dto';
import { CalculatedStat } from './entity/calculatedStats.entity';

@Injectable()
export class CalculatedStatsService {
  private readonly logger = new Logger(CalculatedStatsService.name);
  constructor(private calculatedStatsRepository: CalculatedStatsRepository) {}

  async getAllCalculatedStats(page: number, limit: number): Promise<CalculatedStat[]> {
    this.logger.log(`Trying to get all calculated stats`);

    const offset = (page - 1) * limit;
    const [calculatedStats, count] = await this.calculatedStatsRepository.getAllCalculatedStats(offset, limit);

    this.logger.debug(`${count} calculated stat successfully get `);

    return calculatedStats;
  }

  async getCalculatedStatsByUsername(
    username: CalculatedStat['username'],
    page: number,
    limit: number,
  ): Promise<CalculatedStat[]> {
    this.logger.log(`Trying to get all calculated stats by username: ${username}`);

    const offset = (page - 1) * limit;
    const getStatsByUsernameDto: GetStatsByUsernameDto = {
      username,
      limit,
      offset,
    };
    const [calculatedStats, count] =
      await this.calculatedStatsRepository.getCalculatedStatsByUsername(getStatsByUsernameDto);

    this.logger.debug(`${count} calculated stat successfully get by username: ${username}`);

    return calculatedStats;
  }

  async createCalculatedStats(createCalculatedStatsDto: CreateCalculatedStatsDto) {
    const { username } = createCalculatedStatsDto;

    this.logger.log(`Trying to create calculated stats for: ${username}`);

    const { raw } = await this.calculatedStatsRepository.createCalculatedStats(createCalculatedStatsDto);

    this.logger.debug(`calculated stats successfully created with id: ${raw[0].id}`);
  }

  async getCountOfCalculatedStats(): Promise<number> {
    this.logger.log(`Trying to get count of all calculated stats`);

    const count = await this.calculatedStatsRepository.getCountOfCalculatedStats();

    this.logger.debug(`${count} calculated stat successfully counted `);

    return count;
  }
}
