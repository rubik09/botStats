import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AdminsEntity} from "./entity/admins.entity";
import {AdminsController} from "./admins.controller";
import {AdminsService} from "./admins.service";
import {AdminsProvider} from "./admins.provider";

@Module({
    imports: [TypeOrmModule.forFeature([AdminsEntity])],
    controllers: [AdminsController],
    providers: [AdminsService, AdminsProvider],
})
export class AdminsModule {}
