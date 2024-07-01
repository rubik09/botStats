import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { BotAlertProvider } from './botAlert.provider';
import { BotAlertService } from './botAlert.service';

@Module({
  imports: [HttpModule],
  providers: [BotAlertService, BotAlertProvider],
  exports: [BotAlertService],
})
export class BotAlertModule {}
