import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UsersEntity} from "./entity/users.entity";
import {AdminsEntity} from "../admins/entity/admins.entity";
import {AddUserDto} from "./dto/addUser.dto";

@Injectable()
export class UsersProvider {
    constructor(
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>,
    ) {
    }

    async findUserId(api_id_client, user_id): Promise<UsersEntity> {
        return await this.usersRepository.findOne({
            where: {api_id_client, user_id},
        });
    }

    async addUser(addUserDto: AddUserDto): Promise<UsersEntity> {
        const newUser = this.usersRepository.create(addUserDto);
        return this.usersRepository.save(newUser);
    }

    async getCountUsers(api_id_client: string): Promise<number> {
        return this.usersRepository.count({where: {api_id_client}});
    }

    async cleanTable(): Promise<void> {
        await this.usersRepository.delete({});
    }
}


