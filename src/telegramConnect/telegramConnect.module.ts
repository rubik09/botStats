import { Module } from '@nestjs/common';

import { TelegramConnectController } from './telegramConnect.controller';
import { TelegramConnectService } from './telegramConnect.service';
import { TelegramStartService } from './telegramStart.service';
import { BotAlertModule } from '../botAlert/botAlert.module';
import { KafkaModule } from '../kafka/kafka.module';
import { KeywordsModule } from '../keywords/keywords.module';
import { UserSessionModule } from '../userSession/userSession.module';

@Module({
  imports: [UserSessionModule, KafkaModule, KeywordsModule, BotAlertModule],
  providers: [TelegramConnectService, TelegramStartService],
  controllers: [TelegramConnectController],
})
export class TelegramConnectModule {}
