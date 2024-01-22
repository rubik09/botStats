import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {PersonalInfo} from "./entity/personalInfo.entity";
import {CreatePersonalInfoDto} from "./dto/createPersonalInfo.dto";
import {UpdatePersonalInfoDto} from "./dto/updatePersonalInfo.dto";
import {DeletePersonalInfoDto} from "./dto/deletePersonalInfo.dto";

@Injectable()
export class personalInfoRepository {
    constructor(
        @InjectRepository(PersonalInfo)
        private readonly personalInfoRepository: Repository<PersonalInfo>,
    ) {
    }

    async createPersonalInfo(createPersonalInfoDto: CreatePersonalInfoDto): Promise<void> {
        const newPersonalInfo = this.personalInfoRepository.create(createPersonalInfoDto);
        await this.personalInfoRepository.save(newPersonalInfo);
    }

    async updatePersonalInfo(id: PersonalInfo['id'], updatePersonalInfoDto: UpdatePersonalInfoDto): Promise<void> {
        await this.personalInfoRepository.update({id}, updatePersonalInfoDto);
    }


    async checkByPhone(phoneNumber: PersonalInfo['phoneNumber']): Promise<PersonalInfo> {
        return await this.personalInfoRepository.findOne({where: {phoneNumber}});
    }

    async checkByUserId(id: PersonalInfo['id']): Promise<PersonalInfo> {
        return await this.personalInfoRepository.findOne({where: {id}});
    }

    async checkByUsername(username: PersonalInfo['username']): Promise<PersonalInfo> {
        return await this.personalInfoRepository.findOne({where: {username}});
    }

    async getUsernameById(id: PersonalInfo['id']): Promise<PersonalInfo> {
        return await this.personalInfoRepository.findOne({where: {id}, select: ['username']});
    }

    async getPhoneById(id: PersonalInfo['id']): Promise<PersonalInfo> {
        return await this.personalInfoRepository.findOne({where: {id}, select: ['phoneNumber'],});
    }

    async deletePersonalInfoById(deletePersonalInfoDto: DeletePersonalInfoDto): Promise<void> {
        await this.personalInfoRepository.delete(deletePersonalInfoDto);
    }
}
