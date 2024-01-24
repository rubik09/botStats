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

    async createPersonalInfo(createPersonalInfoDto: CreatePersonalInfoDto): Promise<PersonalInfo> {
        return await this.personalInfoRepository.save(createPersonalInfoDto);
    }

    async updatePersonalInfo(id: PersonalInfo['id'], updatePersonalInfoDto: UpdatePersonalInfoDto): Promise<number> {
        const {affected} = await this.personalInfoRepository.update({id}, updatePersonalInfoDto);
        return affected;
    }


    async getByPhone(phoneNumber: PersonalInfo['phoneNumber']): Promise<PersonalInfo> {
        return await this.personalInfoRepository.findOne({where: {phoneNumber}});
    }

    async getByUserId(id: PersonalInfo['id']): Promise<PersonalInfo> {
        return await this.personalInfoRepository.findOne({where: {id}});
    }

    async getByUsername(username: PersonalInfo['username']): Promise<PersonalInfo> {
        return await this.personalInfoRepository.findOne({where: {username}});
    }

    async getUsernameById(id: PersonalInfo['id']): Promise<PersonalInfo> {
        return await this.personalInfoRepository.findOne({where: {id}, select: ['username']});
    }

    async getPhoneById(id: PersonalInfo['id']): Promise<PersonalInfo> {
        return await this.personalInfoRepository.findOne({where: {id}, select: ['phoneNumber'],});
    }

    async deletePersonalInfoById(deletePersonalInfoDto: DeletePersonalInfoDto): Promise<number> {
        const {affected} = await this.personalInfoRepository.delete(deletePersonalInfoDto);
        return affected;
    }
}
