import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';

import { CreateCronJobDto } from './dto/createCronJob.dto';
import { UpdateCronJobDto } from './dto/updateCronJob.dto';
import { CronEntity } from './entity/cron.entity';
import { MetricNames } from '../metrics/metrics.constant';

@Injectable()
export class CronRepository {
  constructor(
    @InjectMetric(MetricNames.DB_REQUEST_CRON_TOTAL) private dbRequestTotal: Counter<string>,
    @InjectRepository(CronEntity)
    private readonly cronEntityRepository: Repository<CronEntity>,
  ) {}

  async getCronJobs(): Promise<[CronEntity[], number]> {
    this.dbRequestTotal.inc({ method: 'getCronJobs' });
    return await this.cronEntityRepository.createQueryBuilder('cron').getManyAndCount();
  }

  async getCronJobByNameAndTime(name: string, time: string): Promise<CronEntity> {
    this.dbRequestTotal.inc({ method: 'getCronJobByNameAndTime' });
    return await this.cronEntityRepository
      .createQueryBuilder('cron')
      .where('name = :name', { name })
      .where('time = :time', { time })
      .getOne();
  }

  async getCronJobById(id: number): Promise<CronEntity> {
    this.dbRequestTotal.inc({ method: 'getCronJobById' });
    return await this.cronEntityRepository.createQueryBuilder('cron').where('id = :id', { id }).getOne();
  }

  async createCronJob(createCronJobDto: CreateCronJobDto): Promise<InsertResult> {
    this.dbRequestTotal.inc({ method: 'createCronJob' });
    return await this.cronEntityRepository
      .createQueryBuilder('cron')
      .insert()
      .into(CronEntity)
      .values(createCronJobDto)
      .execute();
  }

  async updateCronJob(id: number, updateCronJobDto: UpdateCronJobDto): Promise<UpdateResult> {
    this.dbRequestTotal.inc({ method: 'updateCronJob' });
    return await this.cronEntityRepository
      .createQueryBuilder('cron')
      .update(CronEntity)
      .set(updateCronJobDto)
      .where('id = :id', { id })
      .execute();
  }

  async deleteCronJob(id: number): Promise<DeleteResult> {
    this.dbRequestTotal.inc({ method: 'deleteCronJob' });
    return await this.cronEntityRepository.createQueryBuilder('cron').delete().where('id = :id', { id }).execute();
  }
}
