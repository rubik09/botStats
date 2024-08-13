import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';

import { CreateCronJobDto } from './dto/createCronJob.dto';
import { UpdateCronJobDto } from './dto/updateCronJob.dto';
import { CronEntity } from './entity/cron.entity';
import { CounterMetricsConfig, CronMethodNames, HistogramMetricsConfig, Status } from '../metrics/metrics.constant';

@Injectable()
export class CronRepository {
  constructor(
    @InjectMetric(CounterMetricsConfig.DB_REQUEST_CRON_TOTAL.name) private dbRequestTotal: Counter<string>,
    @InjectMetric(HistogramMetricsConfig.DB_REQUEST_CRON_DURATION.name)
    private readonly dbRequestDuration: Histogram<string>,
    @InjectRepository(CronEntity)
    private readonly cronEntityRepository: Repository<CronEntity>,
  ) {}

  async getCronJobs(): Promise<[CronEntity[], number]> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: CronMethodNames.GET_CRON_JOBS });
    this.dbRequestTotal.inc({ method: CronMethodNames.GET_CRON_JOBS });

    try {
      const result = await this.cronEntityRepository.createQueryBuilder('cron').getManyAndCount();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }

  async getCronJobByNameAndTime(name: string, time: string): Promise<CronEntity> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: CronMethodNames.GET_CRON_JOB_BY_NAME_AND_TIME });
    this.dbRequestTotal.inc({ method: CronMethodNames.GET_CRON_JOB_BY_NAME_AND_TIME });

    try {
      const result = await this.cronEntityRepository
        .createQueryBuilder('cron')
        .where('name = :name', { name })
        .andWhere('time = :time', { time })
        .getOne();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }

  async getCronJobById(id: number): Promise<CronEntity> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: CronMethodNames.GET_CRON_JOB_BY_ID });
    this.dbRequestTotal.inc({ method: CronMethodNames.GET_CRON_JOB_BY_ID });

    try {
      const result = await this.cronEntityRepository.createQueryBuilder('cron').where('id = :id', { id }).getOne();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }

  async createCronJob(createCronJobDto: CreateCronJobDto): Promise<InsertResult> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: CronMethodNames.CREATE_CRON_JOB });
    this.dbRequestTotal.inc({ method: CronMethodNames.CREATE_CRON_JOB });

    try {
      const result = await this.cronEntityRepository
        .createQueryBuilder('cron')
        .insert()
        .into(CronEntity)
        .values(createCronJobDto)
        .execute();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }

  async updateCronJob(id: number, updateCronJobDto: UpdateCronJobDto): Promise<UpdateResult> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: CronMethodNames.UPDATE_CRON_JOB });
    this.dbRequestTotal.inc({ method: CronMethodNames.UPDATE_CRON_JOB });

    try {
      const result = await this.cronEntityRepository
        .createQueryBuilder('cron')
        .update(CronEntity)
        .set(updateCronJobDto)
        .where('id = :id', { id })
        .execute();
      timerRequest({ status: Status.SUCCESS });
      return result;
    } catch (error) {
      timerRequest({ status: Status.ERROR });
      throw error;
    }
  }

  async deleteCronJob(id: number): Promise<DeleteResult> {
    const timerRequest = this.dbRequestDuration.startTimer({ method: CronMethodNames.DELETE_CRON_JOB });
    this.dbRequestTotal.inc({ method: CronMethodNames.DELETE_CRON_JOB });

    try {
      const result = await this.cronEntityRepository
        .createQueryBuilder('cron')
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
