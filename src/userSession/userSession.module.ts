import { Module } from '@nestjs/common';
import { UserSessionService } from './userSession.service';
import { UserSessionController } from './userSession.controller';
import {UserSessionRepository} from "./userSession.repository";

@Module({
  providers: [UserSessionService, UserSessionRepository],
  controllers: [UserSessionController]
})
export class UserSessionModule {}
