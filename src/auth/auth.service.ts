import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
      private jwtService: JwtService,
  ) {}

  async validatePassword(password: string, adminPassword: string) {
    const isMatch = bcrypt.compareSync(password, adminPassword);

    if (!isMatch) {
      throw new BadRequestException('password or email incorrect');
    }
  }

  async signKey(payload: {email: string}): Promise<string> {
      return this.jwtService.sign(payload);
  }
}
