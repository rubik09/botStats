import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository, InsertResult} from 'typeorm';

import { Admin } from './entity/admins.entity';
import {AdminRegisterDto} from "./dto/adminRegister.dto";

@Injectable()
export class AdminsRepository {
  constructor(
    @InjectRepository(Admin)
    private readonly adminsRepository: Repository<Admin>,
  ) {}

  async createAdmin(adminRegisterDto: AdminRegisterDto): Promise<InsertResult> {
    return await this.adminsRepository
        .createQueryBuilder('admins')
        .insert()
        .into(Admin)
        .values(adminRegisterDto)
        .execute();
  }

  async findOneByEmail(email: string): Promise<Admin> {
    return await this.adminsRepository
        .createQueryBuilder('admins')
        .where('admins.email = :email', { email })
        .getOne();
  }
}
