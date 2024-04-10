import {BadRequestException, HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';

import { AdminsRepository } from './admins.repository';
import { Admin } from './entity/admins.entity';
import * as bcrypt from "bcrypt";
import {AuthService} from "../auth/auth.service";
import {AdminRegisterDto} from "./dto/adminRegister.dto";
import {AdminLoginDto} from "./dto/adminLogin.dto";

@Injectable()
export class AdminsService {
  private readonly logger = new Logger(AdminsService.name);
  constructor(
      private adminsRepository: AdminsRepository,
      private authService: AuthService
  ) {}

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

  async createAdmin(adminRegisterDto: AdminRegisterDto) {
    const { email } = adminRegisterDto;

    this.logger.log(`Trying to create admin with email: ${email}`);

    const admin = await this.adminsRepository.findOneByEmail(email);

    if (admin) {
      this.logger.error(`admin with email: ${email} already exist`);
      throw new HttpException(`admin with email: ${email} already exist`, HttpStatus.BAD_REQUEST);
    }

    const {raw} = await this.adminsRepository.createAdmin(adminRegisterDto);

    this.logger.debug(`admin successfully created with id: ${raw.id}`);
  }

  async validateAdmin(adminLoginDto: AdminLoginDto) {
    const { email, password } = adminLoginDto;

    const admin = await this.findAdminByEmail(email);
    if (!admin) {
      throw new BadRequestException('password or email incorrect');
    }
    await this.authService.validatePassword(password, admin.password)
  }

  async login(adminLoginDto: AdminLoginDto): Promise<{ access_token: string }> {
    const { email } = adminLoginDto;

    this.logger.log(`Trying to login admin with email: ${email}`);

    await this.validateAdmin(adminLoginDto);
    const payload = { email };

    this.logger.debug(`admin with email: ${email} login`);

    return await this.authService.signKey(payload);
  }

  async register(adminRegisterDto: AdminRegisterDto): Promise<{ access_token: string }> {
    const { email, password } = adminRegisterDto;

    this.logger.debug(`Trying to register admin with email: ${email}`);

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = { ...adminRegisterDto, password: hashedPassword };

    await this.createAdmin(newAdmin);

    this.logger.debug(`admin with email: ${email} registered`);

    return this.login(adminRegisterDto);
  }
}
