import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { AdminsRepository } from './admins.repository';

@Module({
  providers: [AdminsService, AdminsRepository],
  controllers: [AdminsController]
})
export class AdminsModule {}
