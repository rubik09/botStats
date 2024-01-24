import {Module} from '@nestjs/common';
import {PersonalInfoService} from './personalInfo.service';
import {PersonalInfoController} from './personalInfo.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {personalInfoRepository} from "./personalInfo.repository";
import {PersonalInfo} from "./entity/personalInfo.entity";

@Module({
    imports: [TypeOrmModule.forFeature([PersonalInfo])],
    providers: [PersonalInfoService, personalInfoRepository],
    controllers: [PersonalInfoController],
})
export class PersonalInfoModule {
}
