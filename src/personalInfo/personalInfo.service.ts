import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { QueryRunner } from 'typeorm';

import { CreatePersonalInfoDto } from './dto/createPersonalInfo.dto';
import { UpdatePersonalInfoDto } from './dto/updatePersonalInfo.dto';
import { PersonalInfo } from './entity/personalInfo.entity';
import { PersonalInfoRepository } from './personalInfo.repository';

@Injectable()
export class PersonalInfoService {
  private readonly logger = new Logger(PersonalInfoService.name);
  constructor(private personalInfoRepository: PersonalInfoRepository) {}

  async updatePersonalInfoByTelegramId(id: PersonalInfo['id'], updatePersonalInfoDto: UpdatePersonalInfoDto) {
    this.logger.log(`Trying to update personal info by id: ${id}`);

    const personalInfo = this.personalInfoRepository.getByUserId(id);

    if (!personalInfo) {
      this.logger.error(`personal info with id: ${id} not found`);
      throw new HttpException(`personal info with id: ${id} not found`, HttpStatus.NOT_FOUND);
    }

    const { affected } = await this.personalInfoRepository.updatePersonalInfo(id, updatePersonalInfoDto);

    this.logger.debug(`${affected} personal info successfully updated by id: ${id}`);
  }

  async deletePersonalInfoById(id: PersonalInfo['id']) {
    this.logger.log(`Trying to delete personal info by: ${id}`);

    const userSession = this.personalInfoRepository.getByUserId(id);

    if (!userSession) {
      this.logger.error(`personal info with id: ${id} not found`);
      throw new HttpException(`personal info with id: ${id} not found`, HttpStatus.NOT_FOUND);
    }

    const { affected } = await this.personalInfoRepository.deletePersonalInfoById(id);

    this.logger.debug(`${affected} personal info successfully deleted by id: ${id}`);
  }

  async createPersonalInfoTransaction(
    queryRunner: QueryRunner,
    createPersonalInfoDto: CreatePersonalInfoDto,
  ): Promise<PersonalInfo> {
    const { username, phoneNumber } = createPersonalInfoDto;
    this.logger.log(
      `Trying to create personal info with transaction by username: ${username} and phoneNumber: ${phoneNumber}`,
    );

    const personalInfoByUsername = await this.personalInfoRepository.findPersonalInfoByUsername(username);
    const personalInfoByPhone = await this.personalInfoRepository.findPersonalInfoByPhone(phoneNumber);

    if (personalInfoByUsername) {
      this.logger.error(`personal info with username: ${username} already exist`);
      throw new HttpException(`personal info with username: ${username} already exist`, HttpStatus.BAD_REQUEST);
    }

    if (personalInfoByPhone) {
      this.logger.error(`personal info with phone: ${phoneNumber} already exist`);
      throw new HttpException(`personal info with phone: ${phoneNumber} already exist`, HttpStatus.BAD_REQUEST);
    }

    const newPersonalInfo = await this.personalInfoRepository.createPersonalInfoTransaction(
      queryRunner,
      createPersonalInfoDto,
    );

    this.logger.debug(`Personal info successfully created with id: ${newPersonalInfo.id}`);

    return newPersonalInfo;
  }
}
