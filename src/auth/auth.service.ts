import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { AdminsService } from '../admins/admins.service';
import { CreateAdminDto } from '../admins/dto/createAdmin.dto';
import { Admin } from '../admins/entity/admins.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private adminsService: AdminsService,
    private jwtService: JwtService,
  ) {}

  async validateAdmin(email: Admin['email'], password: Admin['password']): Promise<void> {
    const admin: Admin = await this.adminsService.findAdminByEmail(email);
    if (!admin) {
      throw new BadRequestException('password or email incorrect');
    }
    const isMatch: boolean = bcrypt.compareSync(password, admin.password);
    if (!isMatch) {
      throw new BadRequestException('password or email incorrect');
    }
  }

  async login(admin: { password: Admin['password']; email: Admin['email'] }) {
    const { email, password } = admin;

    this.logger.log(`Trying to login admin with email: ${email}`);

    await this.validateAdmin(email, password);
    const payload = { email };

    this.logger.debug(`admin with email: ${email} login`);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createAdminDto: CreateAdminDto): Promise<{ access_token: string }> {
    const { email, password } = createAdminDto;

    this.logger.debug(`Trying to register admin with email: ${email}`);

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = { ...createAdminDto, password: hashedPassword };

    await this.adminsService.createAdmin(newAdmin);

    this.logger.debug(`admin with email: ${email} registered`);

    return this.login(createAdminDto);
  }
}
