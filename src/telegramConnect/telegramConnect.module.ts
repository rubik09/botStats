import { Module } from '@nestjs/common';
import { TelegramConnectService } from './telegramConnect.service';
import { TelegramConnectController } from './telegramConnect.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserSession} from "../userSession/entity/userSession.entity";
import {UserSessionRepository} from "../userSession/userSession.repository";

@Module({
  imports: [TypeOrmModule.forFeature([UserSession])],
  providers: [TelegramConnectService, UserSessionRepository],
  controllers: [TelegramConnectController]
})
export class TelegramConnectModule {}
