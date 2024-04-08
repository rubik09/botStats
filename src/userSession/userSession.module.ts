import {Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonalInfoModule } from "../personalInfo/personalInfo.module";

import { UserSession } from './entity/userSession.entity';
import { UserSessionController } from './userSession.controller';
import { UserSessionRepository } from './userSession.repository';
import { UserSessionService } from './userSession.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserSession]), PersonalInfoModule],
  providers: [UserSessionService, UserSessionRepository],
  controllers: [UserSessionController],
  exports: [UserSessionRepository, UserSessionService],
})
export class UserSessionModule {}
