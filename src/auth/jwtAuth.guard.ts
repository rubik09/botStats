import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Observable } from 'rxjs';

import { HASHED_PASSWORD, SECRET_JWT } from './jwtConst';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): Promise<boolean> | boolean | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      return false;
    }

    try {
      const decoded = this.jwtService.verify(token, { secret: SECRET_JWT });
      return bcrypt.compareSync(decoded, HASHED_PASSWORD);
    } catch (e) {
      return false;
    }
  }
}
