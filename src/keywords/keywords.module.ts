import {forwardRef, Module} from '@nestjs/common';
import { KeywordsService } from './keywords.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Keywords} from "./entity/keywords.entity";
import {KeywordsRepository} from "./keywords.repository";
import {UserSessionModule} from "../userSession/userSession.module";
import { KeywordsController } from './keywords.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Keywords]), forwardRef(() => UserSessionModule)],
  providers: [KeywordsService, KeywordsRepository],
  exports: [KeywordsService],
  controllers: [KeywordsController],
})
export class KeywordsModule {}
