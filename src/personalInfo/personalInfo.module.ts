import {Module} from '@nestjs/common';
import {PersonalInfoService} from './personalInfo.service';
import {PersonalInfoController} from './personalInfo.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {PersonalInfoRepository} from "./personalInfo.repository";
import {PersonalInfo} from "./entity/personalInfo.entity";
import {UserSessionModule} from "../userSession/userSession.module";

@Module({
    imports: [TypeOrmModule.forFeature([PersonalInfo]), UserSessionModule],
    providers: [PersonalInfoService, PersonalInfoRepository],
    controllers: [PersonalInfoController],
})
export class PersonalInfoModule {
}
