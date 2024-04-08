import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PersonalInfo } from './entity/personalInfo.entity';
import { PersonalInfoController } from './personalInfo.controller';
import { PersonalInfoRepository } from './personalInfo.repository';
import { PersonalInfoService } from './personalInfo.service';
import { UserSessionModule } from '../userSession/userSession.module';

@Module({
  imports: [TypeOrmModule.forFeature([PersonalInfo])],
  providers: [PersonalInfoService, PersonalInfoRepository],
  controllers: [PersonalInfoController],
  exports: [PersonalInfoRepository, PersonalInfo]
})
export class PersonalInfoModule {}
