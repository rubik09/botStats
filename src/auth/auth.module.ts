import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { LocalStrategy } from './jwt.strategy';
import { SECRET_JWT } from './jwtConst';

@Module({
  imports: [
    JwtModule.register({
      secret: SECRET_JWT,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
