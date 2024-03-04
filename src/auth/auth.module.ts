import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { LocalStrategy } from './jwt.strategy';
import { SECRET_JWT } from './jwtConst';
import { AdminsModule } from '../admins/admins.module';

@Module({
  imports: [
    forwardRef(() => AdminsModule),
    JwtModule.register({
      secret: SECRET_JWT,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService, LocalStrategy],
})
export class AuthModule {}
