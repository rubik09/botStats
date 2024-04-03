import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateAdminDto } from './dto/createAdmin.dto';
import { DeleteAdminDto } from './dto/deleteAdmin.dto';
import { UpdateAdminDto } from './dto/updateAdmin.dto';
import { Admin } from './entity/admins.entity';
import { UserSession } from '../userSession/entity/userSession.entity';

@Injectable()
export class AdminsRepository {
  constructor(
    @InjectRepository(Admin)
    private readonly adminsRepository: Repository<Admin>,
  ) {}

  async createAdmin(createAdminDto: CreateAdminDto): Promise<Admin> {
    return await this.adminsRepository.save(createAdminDto);
  }

  async findOneByEmail(email: Admin['email']): Promise<Admin> {
    return await this.adminsRepository.findOne({
      where: { email },
    });
  }

  async findOneById(id: Admin['id']): Promise<Admin> {
    return await this.adminsRepository.findOne({
      where: { id },
    });
  }

  async deleteAdminById(deleteAdminDto: DeleteAdminDto): Promise<number> {
    const { affected } = await this.adminsRepository.delete(deleteAdminDto);
    return affected;
  }

  async updateAdmin(id: UserSession['id'], updateAdminDto: UpdateAdminDto): Promise<number> {
    const { affected } = await this.adminsRepository.update({ id }, updateAdminDto);
    return affected;
  }
}
