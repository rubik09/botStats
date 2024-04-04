import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';

import { CreateUserDto } from './dto/createUser.dto';
import { DeleteUserDto } from './dto/deleteUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from './entity/users.entity';
import {FindByApiIdAndTgIdDto} from "./dto/findByApiIdAndTgId.dto";

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findUserByApiIdAndTelegramId(findByApiIdAndTgIdDto: FindByApiIdAndTgIdDto): Promise<User> {
    return await this.usersRepository.findOne({
      where: findByApiIdAndTgIdDto,
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.usersRepository.save(createUserDto);
  }

  async getCountUsersByApiId(apiIdClient: number): Promise<number> {
    return await this.usersRepository.count({ where: { apiIdClient } });
  }

  async cleanTableByApiId(apiIdClient: number): Promise<DeleteResult> {
    return await this.usersRepository.delete({ apiIdClient });
  }

  async deleteUserByTelegramId(deleteUserDto: DeleteUserDto): Promise<DeleteResult> {
    return await this.usersRepository.delete(deleteUserDto);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    return await this.usersRepository.update({ id }, updateUserDto);
  }
}
