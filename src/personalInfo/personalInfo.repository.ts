import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { UpdatePersonalInfoDto } from './dto/updatePersonalInfo.dto';
import { PersonalInfo } from './entity/personalInfo.entity';

@Injectable()
export class PersonalInfoRepository {
  constructor(
    @InjectRepository(PersonalInfo)
    private readonly personalInfoRepository: Repository<PersonalInfo>,
  ) {}

  async updatePersonalInfo(id: number, updatePersonalInfoDto: UpdatePersonalInfoDto): Promise<UpdateResult> {
    return await this.personalInfoRepository
      .createQueryBuilder('personalInfo')
      .update(PersonalInfo)
      .set(updatePersonalInfoDto)
      .where('id = :id', { id })
      .execute();
  }

  async getByUserId(id: number): Promise<PersonalInfo> {
    return await this.personalInfoRepository.createQueryBuilder('personalInfo').where('id = :id', { id }).getOne();
  }

  async deletePersonalInfoById(id: number): Promise<DeleteResult> {
    return await this.personalInfoRepository
      .createQueryBuilder('personalInfo')
      .delete()
      .where('id = :id', { id })
      .execute();
  }
}
