import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import {Sessions} from "./entity/sessions";
import {TypeOrmModule} from "@nestjs/typeorm";
import {SessionsRepository} from "./sessions.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Sessions])],
  controllers: [SessionsController],
  providers: [SessionsService, SessionsRepository],
})
export class SessionsModule {}
