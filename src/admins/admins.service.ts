import { BadRequestException, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { AdminsRepository } from './admins.repository';
import { AdminLoginDto } from './dto/adminLogin.dto';
import { CreateAdminDto } from './dto/createAdmin.dto';
import { RegisterAdminDto } from './dto/registerAdmin.dto';
import { Admin } from './entity/admins.entity';
import { AuthService } from '../auth/auth.service';
import { TToken } from '../utils/types';

@Injectable()
export class AdminsService {
  private readonly logger = new Logger(AdminsService.name);
  private readonly hash: number;
  constructor(
    private adminsRepository: AdminsRepository,
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    this.hash = this.configService.getOrThrow('HASH.HASH_LENGTH');
  }

  async findAdminByEmail(email: Admin['email']): Promise<Admin> {
    this.logger.log(`Trying to get personal info by email: ${email}`);

    const admin = this.adminsRepository.findOneByEmail(email);

    if (!admin) {
      this.logger.error(`admin with email: ${email} not found`);
      throw new HttpException(`admin with email: ${email} not found`, HttpStatus.NOT_FOUND);
    }

    this.logger.debug(`admin successfully get by email: ${email}`);

    return admin;
  }

  async createAdmin({ email, password }: RegisterAdminDto) {
    this.logger.log(`Trying to create admin with email: ${email}`);

    const admin = await this.adminsRepository.findOneByEmail(email);

    if (admin) {
      this.logger.error(`admin with email: ${email} already exist`);
      throw new HttpException(`admin with email: ${email} already exist`, HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, this.hash);
    const createAdminDto: CreateAdminDto = {
      email,
      password: hashedPassword,
    };

    const { raw } = await this.adminsRepository.createAdmin(createAdminDto);

    this.logger.debug(`admin successfully created with id: ${raw.id}`);
  }

  async validatePassword(password: string, adminPassword: string) {
    const isMatch = bcrypt.compareSync(password, adminPassword);

    if (!isMatch) {
      throw new BadRequestException('password or email incorrect');
    }
  }

  async login({ email, password }: AdminLoginDto): Promise<TToken> {
    const admin = await this.adminsRepository.findOneByEmail(email);

    if (!admin) {
      throw new BadRequestException('password or email incorrect');
    }
    await this.validatePassword(password, admin.password);

    return await this.authService.signKey({ email });
  }
}
