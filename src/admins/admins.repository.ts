import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';

import { CreateAdminDto } from './dto/createAdmin.dto';
import { DeleteAdminDto } from './dto/deleteAdmin.dto';
import { UpdateAdminDto } from './dto/updateAdmin.dto';
import { Admin } from './entity/admins.entity';

@Injectable()
export class AdminsRepository {
  constructor(
    @InjectRepository(Admin)
    private readonly adminsRepository: Repository<Admin>,
  ) {}

  async createAdmin(createAdminDto: CreateAdminDto): Promise<Admin> {
    return await this.adminsRepository.save(createAdminDto);
  }

  async findOneByEmail(email: string): Promise<Admin> {
    return await this.adminsRepository.findOne({
      where: { email },
    });
  }

  async findOneById(id: number): Promise<Admin> {
    return await this.adminsRepository.findOne({
      where: { id },
    });
  }

  async deleteAdminById(deleteAdminDto: DeleteAdminDto): Promise<DeleteResult> {
    return await this.adminsRepository.delete(deleteAdminDto);
  }

  async updateAdmin(id: number, updateAdminDto: UpdateAdminDto): Promise<UpdateResult> {
    return await this.adminsRepository.update({ id }, updateAdminDto);
  }
}
