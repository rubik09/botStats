import {Module} from '@nestjs/common';
import {UsersService} from './users.service';
import {UsersController} from './users.controller';
import {UsersRepository} from "./users.repository";
import {Users} from "./entity/users.entity";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([Users])],
    providers: [UsersService, UsersRepository],
    controllers: [UsersController]
})
export class UsersModule {
}
