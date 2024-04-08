import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import { AdminsRepository } from './admins.repository';
import { CreateAdminDto } from './dto/createAdmin.dto';
import { Admin } from './entity/admins.entity';

@Injectable()
export class AdminsService {
  private readonly logger = new Logger(AdminsService.name);
  constructor(private adminsRepository: AdminsRepository) {}

  async findAdminByEmail(email: Admin['email']): Promise<Admin> {
    this.logger.log(`Trying to get personal info by email: ${email}`);

    const admin = this.adminsRepository.findOneByEmail(email);

    if (!admin) {
      this.logger.error(`admin with email: ${email} not found`);
      throw new HttpException(`admin with email: ${email} not found`, HttpStatus.NOT_FOUND);
    }

    this.logger.debug(`admin successfully get by email: ${email}`);

    return admin;
  }

  async createAdmin(createAdminDto: CreateAdminDto) {
    const { email } = createAdminDto;

    this.logger.log(`Trying to create admin with email: ${email}`);

    const admin = await this.adminsRepository.findOneByEmail(email);

    if (admin) {
      this.logger.error(`admin with email: ${email} already exist`);
      throw new HttpException(`admin with email: ${email} already exist`, HttpStatus.BAD_REQUEST);
    }

    const {raw} = await this.adminsRepository.createAdmin(createAdminDto);

    this.logger.debug(`admin successfully created with id: ${raw.id}`);
  }
}
