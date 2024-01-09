import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { AdminsProvider } from './admins.provider';

@Module({
  providers: [AdminsService, AdminsProvider],
  controllers: [AdminsController]
})
export class AdminsModule {}
