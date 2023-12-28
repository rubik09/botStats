import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import {UsersEntity} from "./entity/users.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersService} from "./users.service";
import {UsersProvider} from "./users.provider";

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  controllers: [UsersController],
  providers: [UsersService, UsersProvider],
})
export class UsersModule {}
