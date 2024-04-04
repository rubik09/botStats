import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';

import { CreatePersonalInfoDto } from './dto/createPersonalInfo.dto';
import { UpdatePersonalInfoDto } from './dto/updatePersonalInfo.dto';
import { PersonalInfo } from './entity/personalInfo.entity';

@Injectable()
export class PersonalInfoRepository {
  constructor(
    @InjectRepository(PersonalInfo)
    private readonly personalInfoRepository: Repository<PersonalInfo>,
  ) {}

  async createPersonalInfo(createPersonalInfoDto: CreatePersonalInfoDto): Promise<PersonalInfo> {
    return await this.personalInfoRepository.save(createPersonalInfoDto);
  }

  async updatePersonalInfo(id: number, updatePersonalInfoDto: UpdatePersonalInfoDto): Promise<UpdateResult> {
    return await this.personalInfoRepository.update({ id }, updatePersonalInfoDto);
  }

  async getByPhone(phoneNumber: string): Promise<PersonalInfo> {
    return await this.personalInfoRepository.findOne({
      where: { phoneNumber },
    });
  }

  async getByUserId(id: number): Promise<PersonalInfo> {
    return await this.personalInfoRepository.findOne({ where: { id } });
  }

  async getByUsername(username: string): Promise<PersonalInfo> {
    return await this.personalInfoRepository.findOne({ where: { username } });
  }

  async getUsernameById(id: number): Promise<PersonalInfo> {
    return await this.personalInfoRepository.findOne({
      where: { id },
      select: ['id', 'username'],
    });
  }

  async getPhoneById(id: number): Promise<PersonalInfo> {
    return await this.personalInfoRepository.findOne({
      where: { id },
      select: ['id', 'phoneNumber'],
    });
  }

  async deletePersonalInfoById(id: number): Promise<DeleteResult> {
    return await this.personalInfoRepository.delete({ id });
  }
}
