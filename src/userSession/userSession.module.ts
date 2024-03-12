import {forwardRef, Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserSession } from './entity/userSession.entity';
import { UserSessionController } from './userSession.controller';
import { UserSessionRepository } from './userSession.repository';
import { UserSessionService } from './userSession.service';
import {KeywordsModule} from "../keywords/keywords.module";

@Module({
  imports: [TypeOrmModule.forFeature([UserSession]), forwardRef(() => KeywordsModule)],
  providers: [UserSessionService, UserSessionRepository],
  controllers: [UserSessionController],
  exports: [UserSessionRepository, UserSessionService],
})
export class UserSessionModule {}
