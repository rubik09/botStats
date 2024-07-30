import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';

import { CreateCronJobDto } from './dto/createCronJob.dto';
import { UpdateCronJobDto } from './dto/updateCronJob.dto';
import { CronEntity } from './entity/cron.entity';
import { CronMethodNames, MetricLabels, MetricNames } from '../metrics/metrics.constant';

@Injectable()
export class CronRepository {
  constructor(
    @InjectMetric(MetricNames.DB_REQUEST_CRON_TOTAL) private dbRequestTotal: Counter<string>,
    @InjectRepository(CronEntity)
    private readonly cronEntityRepository: Repository<CronEntity>,
  ) {}

  async getCronJobs(): Promise<[CronEntity[], number]> {
    this.dbRequestTotal.inc({ [MetricLabels.METHOD]: CronMethodNames.GET_CRON_JOBS });
    return await this.cronEntityRepository.createQueryBuilder('cron').getManyAndCount();
  }

  async getCronJobByNameAndTime(name: string, time: string): Promise<CronEntity> {
    this.dbRequestTotal.inc({ [MetricLabels.METHOD]: CronMethodNames.GET_CRON_JOB_BY_NAME_AND_TIME });
    return await this.cronEntityRepository
      .createQueryBuilder('cron')
      .where('name = :name', { name })
      .andWhere('time = :time', { time })
      .getOne();
  }

  async getCronJobById(id: number): Promise<CronEntity> {
    this.dbRequestTotal.inc({ [MetricLabels.METHOD]: CronMethodNames.GET_CRON_JOB_BY_ID });
    return await this.cronEntityRepository.createQueryBuilder('cron').where('id = :id', { id }).getOne();
  }

  async createCronJob(createCronJobDto: CreateCronJobDto): Promise<InsertResult> {
    this.dbRequestTotal.inc({ [MetricLabels.METHOD]: CronMethodNames.CREATE_CRON_JOB });
    return await this.cronEntityRepository
      .createQueryBuilder('cron')
      .insert()
      .into(CronEntity)
      .values(createCronJobDto)
      .execute();
  }

  async updateCronJob(id: number, updateCronJobDto: UpdateCronJobDto): Promise<UpdateResult> {
    this.dbRequestTotal.inc({ [MetricLabels.METHOD]: CronMethodNames.UPDATE_CRON_JOB });
    return await this.cronEntityRepository
      .createQueryBuilder('cron')
      .update(CronEntity)
      .set(updateCronJobDto)
      .where('id = :id', { id })
      .execute();
  }

  async deleteCronJob(id: number): Promise<DeleteResult> {
    this.dbRequestTotal.inc({ [MetricLabels.METHOD]: CronMethodNames.DELETE_CRON_JOB });
    return await this.cronEntityRepository.createQueryBuilder('cron').delete().where('id = :id', { id }).execute();
  }
}
