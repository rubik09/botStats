import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { CalculatedStatsService } from './calculatedStats.service';
import { GetStatsDto } from './dto/getStats.dto';
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
    @Query('from') from: GetStatsDto['from'],
    @Query('to') to: GetStatsDto['to'],
  ): Promise<{ calculatedStats: CalculatedStat[]; count: number }> {
    const [calculatedStats, count] = await this.calculatedStatsService.getCalculatedStats(
      username,
      page,
      limit,
      from,
      to,
    );
    return {
      calculatedStats,
      count,
    };
  }
}
