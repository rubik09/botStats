import { Module } from '@nestjs/common';
import { TelegramConnectService } from './telegramConnect.service';
import { TelegramConnectController } from './telegramConnect.controller';

@Module({
  providers: [TelegramConnectService],
  controllers: [TelegramConnectController]
})
export class TelegramConnectModule {}
