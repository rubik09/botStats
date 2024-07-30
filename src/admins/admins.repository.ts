import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { InsertResult, Repository } from 'typeorm';

import { CreateAdminDto } from './dto/createAdmin.dto';
import { Admin } from './entity/admins.entity';
import { AdminMethodNames, MetricLabels, MetricNames } from '../metrics/metrics.constant';

@Injectable()
export class AdminsRepository {
  constructor(
    @InjectMetric(MetricNames.DB_REQUEST_ADMINS_TOTAL) private dbRequestTotal: Counter<string>,
    @InjectRepository(Admin)
    private readonly adminsRepository: Repository<Admin>,
  ) {}

  async createAdmin(createAdminDto: CreateAdminDto): Promise<InsertResult> {
    this.dbRequestTotal.inc({ [MetricLabels.METHOD]: AdminMethodNames.CREATE_ADMIN });
    return await this.adminsRepository
      .createQueryBuilder('admins')
      .insert()
      .into(Admin)
      .values(createAdminDto)
      .execute();
  }

  async findOneByEmail(email: string): Promise<Admin> {
    this.dbRequestTotal.inc({ [MetricLabels.METHOD]: AdminMethodNames.FIND_ONE_BY_EMAIL });
    return await this.adminsRepository.createQueryBuilder('admins').where('admins.email = :email', { email }).getOne();
  }
}
