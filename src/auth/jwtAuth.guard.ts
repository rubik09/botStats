import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

import { Admins } from '../admins/entity/admins.entity';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext): Promise<boolean> | boolean | Observable<boolean> {
    return super.canActivate(context);
  }

  async validate(payload: { email: Admins['email'] }) {
    return { email: payload.email };
  }
}
