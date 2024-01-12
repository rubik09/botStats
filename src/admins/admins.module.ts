import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import {Admins} from "./entity/admins";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AdminsRepository} from "./admins.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Admins])],
  controllers: [AdminsController],
  providers: [AdminsService, AdminsRepository],
})
export class AdminsModule {}
