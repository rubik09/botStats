import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { SECRET_JWT } from './jwtConst';
import {Admin} from "../admins/entity/admins.entity";

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

  validate(email: Admin['email']) {
    return email;
  }
}
