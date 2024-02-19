import { Module } from '@nestjs/common';
import { TelegramConnectService } from './telegramConnect.service';
import { TelegramConnectController } from './telegramConnect.controller';
import {UserSessionModule} from "../userSession/userSession.module";
import {TelegramStartService} from "./telegramStart.service";
import {KafkaModule} from "../kafka/kafka.module";

@Module({
  imports: [UserSessionModule, KafkaModule],
  providers: [TelegramConnectService, TelegramStartService],
  controllers: [TelegramConnectController],
})
export class TelegramConnectModule {}
