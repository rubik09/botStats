import { Module } from '@nestjs/common';
import { TelegramConnectService } from './telegramConnect.service';
import { TelegramConnectController } from './telegramConnect.controller';
import {UserSessionModule} from "../userSession/userSession.module";

@Module({
  imports: [UserSessionModule],
  providers: [TelegramConnectService],
  controllers: [TelegramConnectController],
})
export class TelegramConnectModule {}
