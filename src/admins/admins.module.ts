import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { Admins } from '../admins.provider/admins';
import { AdminsController } from './admins.controller';
import { Admins } from '../admins.provider/admins';

@Module({
  providers: [AdminsService, Admins],
  controllers: [AdminsController]
})
export class AdminsModule {}
