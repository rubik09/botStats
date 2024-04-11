import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository, InsertResult} from 'typeorm';

import { Admin } from './entity/admins.entity';
import {CreateAdminDto} from "./dto/createAdmin.dto";

@Injectable()
export class AdminsRepository {
  constructor(
    @InjectRepository(Admin)
    private readonly adminsRepository: Repository<Admin>,
  ) {}

  async createAdmin(createAdminDto: CreateAdminDto): Promise<InsertResult> {
    return await this.adminsRepository
        .createQueryBuilder('admins')
        .insert()
        .into(Admin)
        .values(createAdminDto)
        .execute();
  }

  async findOneByEmail(email: string): Promise<Admin> {
    return await this.adminsRepository
        .createQueryBuilder('admins')
        .where('admins.email = :email', { email })
        .getOne();
  }
}
