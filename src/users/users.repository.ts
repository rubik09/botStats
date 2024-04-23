import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository } from 'typeorm';

import { CreateUserDto } from './dto/createUser.dto';
import { FindByApiIdAndTgIdDto } from './dto/findByApiIdAndTgId.dto';
import { User } from './entity/users.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findUserByApiIdAndTelegramId({ apiIdClient, telegramId }: FindByApiIdAndTgIdDto): Promise<User> {
    return await this.usersRepository
      .createQueryBuilder('users')
      .where('users.api_id_client = :apiIdClient AND users.telegram_id = :telegramId', {
        apiIdClient,
        telegramId,
      })
      .getOne();
  }

  async createUser(createUserDto: CreateUserDto): Promise<InsertResult> {
    return await this.usersRepository.createQueryBuilder('users').insert().into(User).values(createUserDto).execute();
  }

  async getCountUsersByApiId(apiIdClient: number): Promise<number> {
    return await this.usersRepository
      .createQueryBuilder('users')
      .where('users.api_id_client = :apiIdClient', { apiIdClient })
      .getCount();
  }

  async cleanTableByApiId(apiIdClient: number): Promise<DeleteResult> {
    return await this.usersRepository
      .createQueryBuilder('users')
      .delete()
      .from(User)
      .where('users.api_id_client = :apiIdClient', { apiIdClient })
      .execute();
  }
}
