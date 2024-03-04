import { Module } from '@nestjs/common';

import { TelegramConnectController } from './telegramConnect.controller';
import { TelegramConnectService } from './telegramConnect.service';
import { TelegramStartService } from './telegramStart.service';
import { KafkaModule } from '../kafka/kafka.module';
import { UserSessionModule } from '../userSession/userSession.module';

@Module({
  imports: [UserSessionModule, KafkaModule],
  providers: [TelegramConnectService, TelegramStartService],
  controllers: [TelegramConnectController],
})
export class TelegramConnectModule {}
