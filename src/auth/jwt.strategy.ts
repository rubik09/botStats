import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { SECRET_JWT } from './jwtConst';
import { Admins } from '../admins/entity/admins.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: SECRET_JWT,
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(payload: { email: Admins['email'] }) {
    return { email: payload.email };
  }
}
