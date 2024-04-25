import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { CalculatedStatsService } from './calculatedStats.service';
import { CalculatedStat } from './entity/calculatedStats.entity';
import { JwtGuard } from '../auth/jwtAuth.guard';
import { baseLimit, basePage } from '../utils/consts';

@Controller('calculatedStats')
export class CalculatedStatsController {
  constructor(private readonly calculatedStatsService: CalculatedStatsService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getAllCalculatedStats(
    @Query('page') page = basePage,
    @Query('limit') limit = baseLimit,
  ): Promise<CalculatedStat[]> {
    return this.calculatedStatsService.getAllCalculatedStats(page, limit);
  }

  @Get(':username')
  @UseGuards(JwtGuard)
  async getCalculatedStatsByUsername(
    @Param('username') username: CalculatedStat['username'],
    @Query('page') page = basePage,
    @Query('limit') limit = baseLimit,
  ): Promise<CalculatedStat[]> {
    return this.calculatedStatsService.getCalculatedStatsByUsername(username, page, limit);
  }
}
