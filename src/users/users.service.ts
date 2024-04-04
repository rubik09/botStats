import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import { CreateUserDto } from './dto/createUser.dto';
import { User } from './entity/users.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserByApiIdAndTelegramId(createUserDto: CreateUserDto): Promise<User> {
    const { apiIdClient, telegramId } = createUserDto;
    this.logger.log(`Trying to get user by apiId: ${apiIdClient} and telegramId: ${telegramId}`);

    const user = await this.usersRepository.findUserByApiIdAndTelegramId(createUserDto);

    if (!user) {
      this.logger.error(`user with apiId: ${apiIdClient} and telegramId: ${telegramId} not found`);
    }

    this.logger.debug(`user successfully get with id: ${user.id}`);

    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const { apiIdClient, telegramId } = createUserDto;
    this.logger.log(`Trying to create user by apiId: ${apiIdClient} and telegramId: ${telegramId}`);

    const user = await this.getUserByApiIdAndTelegramId(createUserDto);

    if (user) {
      this.logger.error(`user with apiId: ${apiIdClient} and telegramId: ${telegramId} already exist`);
      throw new HttpException(
        `user with apiId: ${apiIdClient} and telegramId: ${telegramId} already exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const {id} = await this.usersRepository.createUser(createUserDto);

    this.logger.debug(`user successfully created with id: ${id}`);
  }

  async getCountUsersByApiId(apiIdClient: User['apiIdClient']): Promise<number> {
    this.logger.log(`Trying to get users count by apiId: ${apiIdClient}`);

    const count = await this.usersRepository.getCountUsersByApiId(apiIdClient);

    this.logger.debug(`users count successfully get: ${count}`);

    return count;
  }

  async cleanTableByApiId(apiIdClient: User['apiIdClient']) {
    this.logger.log(`Trying to clean users table by apiId: ${apiIdClient}`);

    await this.usersRepository.cleanTableByApiId(apiIdClient);

    this.logger.debug(`users table successfully cleaned`);
  }
}
