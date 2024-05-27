import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CronController } from './cron.controller';
import { CronRepository } from './cron.repository';
import { CronService } from './cron.service';
import { CronEntity } from './entity/cron.entity';
import { StatsModule } from '../stats/stats.module';

@Module({
  imports: [TypeOrmModule.forFeature([CronEntity]), StatsModule],
  providers: [CronService, CronRepository],
  controllers: [CronController],
})
export class CronModule {}
