import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import {UsersEntity} from "./entity/users.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersService} from "./users.service";

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
