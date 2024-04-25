import { Controller, Get, UseGuards } from '@nestjs/common';

import { CalculatedStatsService } from './calculatedStats.service';
import { CalculatedStat } from './entity/calculatedStats.entity';
import { JwtGuard } from '../auth/jwtAuth.guard';

@Controller('calculatedStats')
export class CalculatedStatsController {
  constructor(private readonly calculatedStatsService: CalculatedStatsService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getAllCalculatedStats(): Promise<CalculatedStat[]> {
    return this.calculatedStatsService.getAllCalculatedStats();
  }
}
