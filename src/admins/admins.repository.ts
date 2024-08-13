import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';
import { InsertResult, Repository } from 'typeorm';

import { CreateAdminDto } from './dto/createAdmin.dto';
import { Admin } from './entity/admins.entity';
import { AdminMethodNames, CounterMetricsConfig, HistogramMetricsConfig, Status } from '../metrics/metrics.constant';

@Injectable()
export class AdminsRepository {
  constructor(
    @InjectMetric(CounterMetricsConfig.DB_REQUEST_ADMINS_TOTAL.name) private dbRequestTotal: Counter<string>,
    @InjectMetric(HistogramMetricsConfig.DB_REQUEST_ADMINS_DURATION.name)
    private readonly dbRequestDuration: Histogram<string>,
    @InjectRepository(Admin)
    private readonly adminsRepository: Repository<Admin>,
  ) {}

  async createAdmin(createAdminDto: CreateAdminDto): Promise<InsertResult> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: AdminMethodNames.CREATE_ADMIN });
    this.dbRequestTotal.inc({ method: AdminMethodNames.CREATE_ADMIN });

    try {
      const result = await this.adminsRepository
        .createQueryBuilder('admins')
        .insert()
        .into(Admin)
        .values(createAdminDto)
        .execute();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }

  async findOneByEmail(email: string): Promise<Admin> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: AdminMethodNames.FIND_ONE_BY_EMAIL });
    this.dbRequestTotal.inc({ method: AdminMethodNames.FIND_ONE_BY_EMAIL });

    try {
      const result = await this.adminsRepository
        .createQueryBuilder('admins')
        .where('admins.email = :email', { email })
        .getOne();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }
}
