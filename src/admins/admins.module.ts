import {Module} from '@nestjs/common';
import {AdminsService} from './admins.service';
import {AdminsController} from './admins.controller';
import {AdminsRepository} from './admins.repository';
import {Admins} from "./entity/admins.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "../auth/auth.module";


@Module({
    imports: [TypeOrmModule.forFeature([Admins]), AuthModule],
    providers: [AdminsService, AdminsRepository],
    controllers: [AdminsController],
    exports: [AdminsRepository, AdminsService],

})
export class AdminsModule {
}
