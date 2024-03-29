import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminsController } from './admins.controller';
import { AdminsRepository } from './admins.repository';
import { AdminsService } from './admins.service';
import { Admins } from './entity/admins.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Admins]), AuthModule],
  providers: [AdminsService, AdminsRepository],
  controllers: [AdminsController],
  exports: [AdminsRepository, AdminsService],
})
export class AdminsModule {}
