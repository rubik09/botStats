import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { CalculatedStatsService } from './calculatedStats.service';
import { CalculatedStat } from './entity/calculatedStats.entity';
import { JwtGuard } from '../auth/jwtAuth.guard';

@Controller('calculatedStats')
export class CalculatedStatsController {
  constructor(private readonly calculatedStatsService: CalculatedStatsService) {}

  @Get()
  @UseGuards(JwtGuard)
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
