import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {PersonalInfoRepository} from "./personalInfo.repository";
import {PersonalInfo} from "./entity/personalInfo.entity";
import {UpdatePersonalInfoDto} from "./dto/updatePersonalInfo.dto";

@Injectable()
export class PersonalInfoService {
    private readonly logger = new Logger(PersonalInfoService.name);
    constructor(private personalInfoRepository: PersonalInfoRepository) {
    }

    async updatePersonalInfoByTelegramId(id: PersonalInfo['id'], updatePersonalInfoDto: UpdatePersonalInfoDto): Promise<number> {
        this.logger.log(`Trying to update personal info by id: ${id}`);

        const personalInfo = this.personalInfoRepository.getByUserId(id);

        if (!personalInfo) {
            this.logger.error(`personal info with id: ${id} not found`);
            throw new HttpException(`personal info with id: ${id} not found`, HttpStatus.NOT_FOUND);
        }

        const updatedUserSession = this.personalInfoRepository.updatePersonalInfo(id, updatePersonalInfoDto);

        this.logger.debug(`personal info successfully updated`);

        return updatedUserSession;
    }

    async deletePersonalInfoById(id: PersonalInfo['id']): Promise<number> {
        this.logger.log(`Trying to delete personal info by: ${id}`);

        const userSession = this.personalInfoRepository.getByUserId(id);

        if (!userSession) {
            this.logger.error(`personal info with id: ${id} not found`);
            throw new HttpException(`personal info with id: ${id} not found`, HttpStatus.NOT_FOUND);
        }

        const deleted = this.personalInfoRepository.deletePersonalInfoById(id)

        this.logger.debug(`personal info successfully deleted`);

        return deleted;
    }
}
