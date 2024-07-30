import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { UpdatePersonalInfoDto } from './dto/updatePersonalInfo.dto';
import { PersonalInfo } from './entity/personalInfo.entity';
import { MetricLabels, MetricNames, PersonalInfoMethodNames } from '../metrics/metrics.constant';

@Injectable()
export class PersonalInfoRepository {
  constructor(
    @InjectMetric(MetricNames.DB_REQUEST_PERSONAL_INFO_TOTAL) private dbRequestTotal: Counter<string>,
    @InjectRepository(PersonalInfo)
    private readonly personalInfoRepository: Repository<PersonalInfo>,
  ) {}

  async updatePersonalInfo(id: number, updatePersonalInfoDto: UpdatePersonalInfoDto): Promise<UpdateResult> {
    this.dbRequestTotal.inc({ [MetricLabels.METHOD]: PersonalInfoMethodNames.UPDATE_PERSONAL_INFO });
    return await this.personalInfoRepository
      .createQueryBuilder('personalInfo')
      .update(PersonalInfo)
      .set(updatePersonalInfoDto)
      .where('id = :id', { id })
      .execute();
  }

  async getByUserId(id: number): Promise<PersonalInfo> {
    this.dbRequestTotal.inc({ [MetricLabels.METHOD]: PersonalInfoMethodNames.GET_BY_USER_ID });
    return await this.personalInfoRepository.createQueryBuilder('personalInfo').where('id = :id', { id }).getOne();
  }

  async deletePersonalInfoById(id: number): Promise<DeleteResult> {
    this.dbRequestTotal.inc({ [MetricLabels.METHOD]: PersonalInfoMethodNames.DELETE_PERSONAL_INFO_BY_ID });
    return await this.personalInfoRepository
      .createQueryBuilder('personalInfo')
      .delete()
      .where('id = :id', { id })
      .execute();
  }
}
