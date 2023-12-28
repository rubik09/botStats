import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {AdminsEntity} from "./entity/admins.entity";
import {Repository} from "typeorm";

@Injectable()
export class AdminsProvider {
    constructor(
        @InjectRepository(AdminsEntity)
        private readonly adminsRepository: Repository<AdminsEntity>,
    ) {
    }

    async findOneByEmail(email): Promise<AdminsEntity | string> {
        return await this.adminsRepository.findOne({
            where: {email},
        });
    }

    async findOneById(id): Promise<AdminsEntity> {
        return await this.adminsRepository.findOne({
            where: {id},
        });
    }
}
