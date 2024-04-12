import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PersonalInfo } from './entity/personalInfo.entity';
import { PersonalInfoController } from './personalInfo.controller';
import { PersonalInfoRepository } from './personalInfo.repository';
import { PersonalInfoService } from './personalInfo.service';

@Module({
  imports: [TypeOrmModule.forFeature([PersonalInfo])],
  providers: [PersonalInfoService, PersonalInfoRepository],
  controllers: [PersonalInfoController],
  exports: [PersonalInfoRepository],
})
export class PersonalInfoModule {}
