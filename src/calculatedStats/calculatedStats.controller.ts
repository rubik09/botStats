import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { CalculatedStatsService } from './calculatedStats.service';
import { CalculatedStat } from './entity/calculatedStats.entity';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('calculatedStats')
export class CalculatedStatsController {
  constructor(private readonly calculatedStatsService: CalculatedStatsService) {}

  @Get()
  async getCalculatedStats(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('username') username: CalculatedStat['username'],
  ): Promise<{ calculatedStats: CalculatedStat[]; count: number }> {
    const [calculatedStats, count] = await this.calculatedStatsService.getCalculatedStats(username, page, limit);
    return {
      calculatedStats,
      count,
    };
  }
}
