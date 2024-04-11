import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { TPayload, TToken } from "../utils/types";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private jwtService: JwtService,
  ) { }

  async signKey(payload: TPayload): Promise<TToken> {
    const token = await this.jwtService.signAsync(payload);
    return { token };
  }
}
