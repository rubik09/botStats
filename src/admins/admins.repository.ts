import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Admins} from "./entity/admins.entity";
import {Repository} from "typeorm";
import {CreateAdminDto} from "./dto/createAdmin.dto";
import {DeleteAdminDto} from "./dto/deleteAdmin.dto";
import {UserSession} from "../userSession/entity/userSession.entity";
import {UpdateAdminDto} from "./dto/updateAdmin.dto";
import {DeleteResult, UpdateResult} from "../utils/config";

interface AdminsUpdateResult extends UpdateResult {
    raw: Admins,
}

interface AdminsDeleteResult extends DeleteResult {
    raw: Admins,
}

@Injectable()
export class AdminsRepository {
    constructor(
        @InjectRepository(Admins)
        private readonly adminsRepository: Repository<Admins>,
    ) {
    }

    async createAdmin(createAdminDto: CreateAdminDto): Promise<Admins> {
        return await this.adminsRepository.save(createAdminDto);
    }

    async findOneByEmail(email: Admins['email']): Promise<Admins> {
        return await this.adminsRepository.findOne({
            where: {email},
        });
    }

    async findOneById(id: Admins['id']): Promise<Admins> {
        return await this.adminsRepository.findOne({
            where: {id},
        });
    }

    async deleteAdminById(deleteAdminDto: DeleteAdminDto): Promise<AdminsDeleteResult> {
        return await this.adminsRepository.delete(deleteAdminDto);
    }

    async updateAdmin(id: UserSession['id'], updateAdminDto: UpdateAdminDto): Promise<AdminsUpdateResult> {
        return await this.adminsRepository.update({id}, updateAdminDto);
    }
}
