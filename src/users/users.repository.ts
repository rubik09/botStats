import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Users} from "./entity/users";
import {AddUserDto} from "./dto/addUser.dto";
import {FindUserDto} from "./dto/findUser.dto";
import {Sessions} from "../sessions/entity/sessions";

@Injectable()
export class UsersRepository {
    constructor(
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,
    ) {
    }

    async findUserId(findUserDto: FindUserDto): Promise<Users> {
        return await this.usersRepository.findOne({
            where: {...findUserDto},
        });
    }

    async addUser(addUserDto: AddUserDto): Promise<Users> {
        const newUser = this.usersRepository.create(addUserDto);
        return await this.usersRepository.save(newUser);
    }

    async getCountUsers(apiIdClient: Sessions['apiId']): Promise<number> {
        return await this.usersRepository.count({where: {apiIdClient}});
    }

    async cleanTable(): Promise<void> {
        await this.usersRepository.delete({});
    }
}

