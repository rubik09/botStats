import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { UpdatePersonalInfoDto } from './dto/updatePersonalInfo.dto';
import { PersonalInfo } from './entity/personalInfo.entity';
import { MetricNames, PersonalInfoMethodNames, Status } from '../metrics/metrics.constant';

@Injectable()
export class PersonalInfoRepository {
  constructor(
    @InjectMetric(MetricNames.DB_REQUEST_PERSONAL_INFO_TOTAL) private dbRequestTotal: Counter<string>,
    @InjectMetric(MetricNames.DB_REQUEST_PERSONAL_INFO_DURATION) private readonly dbRequestDuration: Histogram<string>,
    @InjectRepository(PersonalInfo)
    private readonly personalInfoRepository: Repository<PersonalInfo>,
  ) {}

  async updatePersonalInfo(id: number, updatePersonalInfoDto: UpdatePersonalInfoDto): Promise<UpdateResult> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: PersonalInfoMethodNames.UPDATE_PERSONAL_INFO });
    this.dbRequestTotal.inc({ method: PersonalInfoMethodNames.UPDATE_PERSONAL_INFO });

    try {
      const result = await this.personalInfoRepository
        .createQueryBuilder('personalInfo')
        .update(PersonalInfo)
        .set(updatePersonalInfoDto)
        .where('id = :id', { id })
        .execute();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }

  async getByUserId(id: number): Promise<PersonalInfo> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: PersonalInfoMethodNames.GET_BY_USER_ID });
    this.dbRequestTotal.inc({ method: PersonalInfoMethodNames.GET_BY_USER_ID });

    try {
      const result = await this.personalInfoRepository
        .createQueryBuilder('personalInfo')
        .where('id = :id', { id })
        .getOne();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }

  async deletePersonalInfoById(id: number): Promise<DeleteResult> {
    const timerRequest = this.dbRequestDuration.startTimer({
      method: PersonalInfoMethodNames.DELETE_PERSONAL_INFO_BY_ID,
    });
    this.dbRequestTotal.inc({ method: PersonalInfoMethodNames.DELETE_PERSONAL_INFO_BY_ID });

    try {
      const result = await this.personalInfoRepository
        .createQueryBuilder('personalInfo')
        .delete()
        .where('id = :id', { id })
        .execute();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }
}
