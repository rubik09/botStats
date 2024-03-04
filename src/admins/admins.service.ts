import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import { AdminsRepository } from './admins.repository';
import { CreateAdminDto } from './dto/createAdmin.dto';
import { Admins } from './entity/admins.entity';

@Injectable()
export class AdminsService {
  private readonly logger = new Logger(AdminsService.name);
  constructor(private adminsRepository: AdminsRepository) {}

  async findAdminById(id: Admins['id']): Promise<Admins> {
    this.logger.log(`Trying to get personal info by id: ${id}`);

    const admin = this.adminsRepository.findOneById(id);

    if (!admin) {
      this.logger.error(`admin with id: ${id} not found`);
      throw new HttpException(`admin with id: ${id} not found`, HttpStatus.NOT_FOUND);
    }

    this.logger.debug(`admin successfully get`);

    return admin;
  }

  async findAdminByEmail(email: Admins['email']): Promise<Admins> {
    this.logger.log(`Trying to get personal info by email: ${email}`);

    const admin = this.adminsRepository.findOneByEmail(email);

    if (!admin) {
      this.logger.error(`admin with email: ${email} not found`);
      throw new HttpException(`admin with email: ${email} not found`, HttpStatus.NOT_FOUND);
    }

    this.logger.debug(`admin successfully get`);

    return admin;
  }

  async createAdmin(createAdminDto: CreateAdminDto): Promise<Admins> {
    this.logger.log(`Trying to create admin`);

    const { email } = createAdminDto;

    const admin = await this.adminsRepository.findOneByEmail(email);

    if (admin) {
      this.logger.error(`admin with email: ${email} already exist`);
      throw new HttpException(`admin with email: ${email} already exist`, HttpStatus.BAD_REQUEST);
    }

    const newAdmin = this.adminsRepository.createAdmin(createAdminDto);

    this.logger.debug(`admin successfully created`);

    return newAdmin;
  }
}
