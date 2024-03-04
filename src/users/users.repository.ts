import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/createUser.dto';
import { DeleteUserDto } from './dto/deleteUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Users } from './entity/users.entity';
import { UserSession } from '../userSession/entity/userSession.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async findUserByApiIdAndTelegramId(createUserDto: CreateUserDto): Promise<Users> {
    return await this.usersRepository.findOne({
      where: createUserDto,
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<Users> {
    return await this.usersRepository.save(createUserDto);
  }

  async getCountUsersByApiId(apiIdClient: Users['apiIdClient']): Promise<number> {
    return await this.usersRepository.count({ where: { apiIdClient } });
  }

  async cleanTable(): Promise<number> {
    const { affected } = await this.usersRepository.delete({});
    return affected;
  }

  async cleanTableByApiId(apiIdClient: Users['apiIdClient']): Promise<number> {
    const { affected } = await this.usersRepository.delete({ apiIdClient });
    return affected;
  }

  async deleteUserByTelegramId(deleteUserDto: DeleteUserDto): Promise<number> {
    const { affected } = await this.usersRepository.delete(deleteUserDto);
    return affected;
  }

  async updateUser(id: UserSession['id'], updateUserDto: UpdateUserDto): Promise<number> {
    const { affected } = await this.usersRepository.update({ id }, updateUserDto);
    return affected;
  }
}
