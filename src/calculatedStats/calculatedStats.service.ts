import { Injectable, Logger } from '@nestjs/common';

import { CalculatedStatsRepository } from './calculatedStats.repository';
import { CreateCalculatedStatsDto } from './dto/createCalculatedStats.dto';
import { CalculatedStat } from './entity/calculatedStats.entity';

@Injectable()
export class CalculatedStatsService {
  private readonly logger = new Logger(CalculatedStatsService.name);
  constructor(private calculatedStatsRepository: CalculatedStatsRepository) {}

  async getAllCalculatedStats(): Promise<CalculatedStat[]> {
    this.logger.log(`Trying to get all calculated stats`);

    const [calculatedStats, count] = await this.calculatedStatsRepository.getAllCalculatedStats();

    this.logger.debug(`${count} calculated stat successfully get `);

    return calculatedStats;
  }

  async createCalculatedStats(createCalculatedStatsDto: CreateCalculatedStatsDto) {
    const { username } = createCalculatedStatsDto;

    this.logger.log(`Trying to create calculated stats for: ${username}`);

    const { raw } = await this.calculatedStatsRepository.createCalculatedStats(createCalculatedStatsDto);

    this.logger.debug(`calculated stats successfully created with id: ${raw[0].id}`);
  }
}
