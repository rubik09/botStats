import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {SessionsEntity} from "./entity/sessions.entity";
import {SessionsController} from "./sessions.controller";
import {SessionsService} from "./sessions.service";
import {SessionsProvider} from "./sessions.provider";

@Module({
  imports: [TypeOrmModule.forFeature([SessionsEntity])],
  controllers: [SessionsController],
  providers: [SessionsService, SessionsProvider],
})
export class SessionsModule {}
