import { Module } from '@nestjs/common';
import { UserSessionService } from './userSession.service';
import { UserSessionController } from './userSession.controller';

@Module({
  providers: [UserSessionService],
  controllers: [UserSessionController]
})
export class UserSessionModule {}
