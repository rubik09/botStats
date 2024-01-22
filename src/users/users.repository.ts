import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Users} from "./entity/users.entity";
import {CreateUserDto} from "./dto/createUser.dto";
import {DeleteUserDto} from "./dto/deleteUser.dto";
import {UserSession} from "../userSession/entity/userSession.entity";
import {UpdateUserDto} from "./dto/updateUser.dto";

@Injectable()
export class UsersRepository {
    constructor(
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,
    ) {
    }

    async findUserById(id: Users['id']): Promise<Users> {
        return await this.usersRepository.findOne({
            where: {id},
        });
    }

    async createUser(createUserDto: CreateUserDto): Promise<Users> {
        return await this.usersRepository.save(createUserDto);
    }

    async getCountUsersById(apiIdClient: Users['apiIdClient']): Promise<number> {
        return await this.usersRepository.count({where: {apiIdClient}});
    }

    async cleanTable(): Promise<void> {
        await this.usersRepository.delete({});
    }

    async deleteUserByTelegramId(deleteUserDto: DeleteUserDto): Promise<void> {
        await this.usersRepository.delete(deleteUserDto);
    }

    async updateUser(id: UserSession['id'], updateUserDto: UpdateUserDto): Promise<void> {
        await this.usersRepository.update({id}, updateUserDto);
    }
}
