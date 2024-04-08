import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository, DeleteResult, UpdateResult, InsertResult} from 'typeorm';

import { UpdatePersonalInfoDto } from './dto/updatePersonalInfo.dto';
import { PersonalInfo } from './entity/personalInfo.entity';
import {CreatePersonalInfoDto} from "./dto/createPersonalInfo.dto";

@Injectable()
export class PersonalInfoRepository {
  constructor(
    @InjectRepository(PersonalInfo)
    private readonly personalInfoRepository: Repository<PersonalInfo>,
  ) {}

  async updatePersonalInfo(id: number, updatePersonalInfoDto: UpdatePersonalInfoDto): Promise<UpdateResult> {
    return await this.personalInfoRepository
      .createQueryBuilder()
      .update(PersonalInfo)
      .set(updatePersonalInfoDto)
      .where("id = :id", { id })
      .execute();
  }

  async getByUserId(id: number): Promise<PersonalInfo> {
    return await this.personalInfoRepository
      .createQueryBuilder()
      .where("id = :id", { id })
      .getOne();
  }

  async createPersonalInfo(personalInfo: CreatePersonalInfoDto): Promise<InsertResult> {
    return await this.personalInfoRepository
        .createQueryBuilder()
        .insert()
        .into(PersonalInfo)
        .values(personalInfo)
        .execute()

  }

  async deletePersonalInfoById(id: number): Promise<DeleteResult> {
    return await this.personalInfoRepository
      .createQueryBuilder()
      .delete()
      .where("id = :id", { id })
      .execute();
  }
}
