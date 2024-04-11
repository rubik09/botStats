import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";
import {TPayload} from "../utils/types";

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

  async signKey(payload: TPayload): Promise<string> {
      return await this.jwtService.signAsync(payload);
  }
}
