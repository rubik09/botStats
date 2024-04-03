import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

import { Admin } from '../admins/entity/admins.entity';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext): Promise<boolean> | boolean | Observable<boolean> {
    return super.canActivate(context);
  }

  async validate(payload: { email: Admin['email'] }) {
    return { email: payload.email };
  }
}
