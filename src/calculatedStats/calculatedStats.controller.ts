import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { CalculatedStatsService } from './calculatedStats.service';
import { GetStatsByUsernameDto } from './dto/getStatsByUsernameDto';
import { CalculatedStat } from './entity/calculatedStats.entity';
import { JwtGuard } from '../auth/jwtAuth.guard';

@Controller('calculatedStats')
export class CalculatedStatsController {
  constructor(private readonly calculatedStatsService: CalculatedStatsService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getAllCalculatedStats(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<CalculatedStat[]> {
    return this.calculatedStatsService.getAllCalculatedStats(page, limit);
  }

  @Get(':username')
  @UseGuards(JwtGuard)
  async getCalculatedStatsByUsername(
    @Param('username') username: CalculatedStat['username'],
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<CalculatedStat[]> {
    const getStatsByUsernameDto: GetStatsByUsernameDto = {
      username,
      page,
      limit
    }
    return this.calculatedStatsService.getCalculatedStatsByUsername(getStatsByUsernameDto);
  }
}
