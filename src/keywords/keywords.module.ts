import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Keyword } from './entity/keywords.entity';
import { KeywordsController } from './keywords.controller';
import { KeywordsRepository } from './keywords.repository';
import { KeywordsService } from './keywords.service';
import { AuthModule } from '../auth/auth.module';
import { UserSessionModule } from '../userSession/userSession.module';

@Module({
  imports: [TypeOrmModule.forFeature([Keyword]), UserSessionModule, AuthModule],
  providers: [KeywordsService, KeywordsRepository],
  exports: [KeywordsService],
  controllers: [KeywordsController],
})
export class KeywordsModule {}
