import { Module } from '@nestjs/common';
import { PersonalInfoService } from './personalInfo.service';
import { PersonalInfoController } from './personalInfo.controller';

@Module({
  providers: [PersonalInfoService],
  controllers: [PersonalInfoController]
})
export class PersonalInfoModule {}
