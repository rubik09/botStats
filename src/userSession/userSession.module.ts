import {Module} from '@nestjs/common';
import {UserSessionService} from './userSession.service';
import {UserSessionController} from './userSession.controller';
import {UserSessionRepository} from "./userSession.repository";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserSession} from "./entity/userSession.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserSession])],
    providers: [UserSessionService, UserSessionRepository],
    controllers: [UserSessionController],
    exports: [UserSessionRepository],
})
export class UserSessionModule {
}
