import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserSession } from './entity/userSession.entity';
import { UserSessionController } from './userSession.controller';
import { UserSessionRepository } from './userSession.repository';
import { UserSessionService } from './userSession.service';
import { BotAlertModule } from '../botAlert/botAlert.module';
import { PersonalInfoModule } from '../personalInfo/personalInfo.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserSession]), PersonalInfoModule, BotAlertModule],
  providers: [UserSessionService, UserSessionRepository],
  controllers: [UserSessionController],
  exports: [UserSessionRepository, UserSessionService],
})
export class UserSessionModule {}
