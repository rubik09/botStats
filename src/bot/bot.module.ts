import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { BotProvider } from './bot.provider';
import { BotService } from './bot.service';

@Module({
  imports: [HttpModule],
  providers: [BotService, BotProvider],
  exports: [BotService],
})
export class BotModule {}
