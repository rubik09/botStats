import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { CreateUserDto } from "./dto/createUser.dto";
import { Users } from "./entity/users.entity";

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserByApiIdAndTelegramId(createUserDto: CreateUserDto) {
    const { apiIdClient, telegramId } = createUserDto;
    this.logger.log(
      `Trying to get user by apiId: ${apiIdClient} and telegramId: ${telegramId}`,
    );

    const user =
      await this.usersRepository.findUserByApiIdAndTelegramId(createUserDto);

    if (!user) {
      this.logger.error(
        `user with apiId: ${apiIdClient} and telegramId: ${telegramId} not found`,
      );
    }

    this.logger.debug(`user successfully get`);

    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<Users> {
    const { apiIdClient, telegramId } = createUserDto;
    this.logger.log(
      `Trying to create user by apiId: ${apiIdClient} and telegramId: ${telegramId}`,
    );

    const user = await this.getUserByApiIdAndTelegramId(createUserDto);

    if (user) {
      this.logger.error(
        `user with apiId: ${apiIdClient} and telegramId: ${telegramId} already exist`,
      );
      throw new HttpException(
        `user with apiId: ${apiIdClient} and telegramId: ${telegramId} already exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newUser = await this.usersRepository.createUser(createUserDto);

    this.logger.debug(`user successfully created`);

    return newUser;
  }

  async getCountUsersByApiId(
    apiIdClient: Users["apiIdClient"],
  ): Promise<number> {
    this.logger.log(`Trying to get users count by apiId: ${apiIdClient}`);

    const count = await this.usersRepository.getCountUsersByApiId(apiIdClient);

    this.logger.debug(`users count successfully get`);

    return count;
  }

  async cleanTable(): Promise<number> {
    this.logger.log(`Trying to clean users table`);

    const cleanTable = this.usersRepository.cleanTable();

    this.logger.debug(`users table successfully cleaned`);

    return cleanTable;
  }

  async cleanTableByApiId(apiIdClient: Users["apiIdClient"]): Promise<number> {
    this.logger.log(`Trying to clean users table`);

    const cleanTable = this.usersRepository.cleanTableByApiId(apiIdClient);

    this.logger.debug(`users table successfully cleaned`);

    return cleanTable;
  }
}
