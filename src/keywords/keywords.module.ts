import {forwardRef, Module} from '@nestjs/common';
import { KeywordsService } from './keywords.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Keyword} from "./entity/keywords.entity";
import {KeywordsRepository} from "./keywords.repository";
import {UserSessionModule} from "../userSession/userSession.module";
import { KeywordsController } from './keywords.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Keyword]), forwardRef(() => UserSessionModule)],
  providers: [KeywordsService, KeywordsRepository],
  exports: [KeywordsService],
  controllers: [KeywordsController],
})
export class KeywordsModule {}
