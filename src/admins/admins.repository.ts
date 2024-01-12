import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Admins} from "./entity/admins";
import {Repository} from "typeorm";

@Injectable()
export class AdminsRepository {
    constructor(
        @InjectRepository(Admins)
        private readonly adminsRepository: Repository<Admins>,
    ) {
    }

    async findOneByEmail(email: string): Promise<Admins> {
        return await this.adminsRepository.findOne({
            where: {email},
        });
    }

    async findOneById(id: number): Promise<Admins> {
        return await this.adminsRepository.findOne({
            where: {id},
        });
    }
}
