import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/createUser.dto';
import { DeleteUserDto } from './dto/deleteUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from './entity/users.entity';
import { UserSession } from '../userSession/entity/userSession.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findUserByApiIdAndTelegramId(createUserDto: CreateUserDto): Promise<User> {
    return await this.usersRepository.findOne({
      where: createUserDto,
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.usersRepository.save(createUserDto);
  }

  async getCountUsersByApiId(apiIdClient: User['apiIdClient']): Promise<number> {
    return await this.usersRepository.count({ where: { apiIdClient } });
  }

  async cleanTable(): Promise<number> {
    const { affected } = await this.usersRepository.delete({});
    return affected;
  }

  async cleanTableByApiId(apiIdClient: User['apiIdClient']): Promise<number> {
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
