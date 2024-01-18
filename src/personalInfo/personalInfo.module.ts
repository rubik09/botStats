import { Module } from '@nestjs/common';
import { PersonalInfoService } from './personalInfo.service';
import { PersonalInfoController } from './personalInfo.controller';
import {PersonalInfoRepository} from "./personalInfo.repository";

@Module({
  providers: [PersonalInfoService, PersonalInfoRepository],
  controllers: [PersonalInfoController]
})
export class PersonalInfoModule {}
