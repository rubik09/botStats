import { Module } from '@nestjs/common';
import { TelegramConnectService } from './telegramConnect.service';
import { TelegramConnectController } from './telegramConnect.controller';
import {UserSessionService} from "../userSession/userSession.service";
import {UserSessionModule} from "../userSession/userSession.module";

@Module({
  imports: [UserSessionModule],
  providers: [TelegramConnectService, UserSessionService],
  controllers: [TelegramConnectController]
})
export class TelegramConnectModule {}
