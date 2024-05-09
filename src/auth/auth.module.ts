import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtGuard } from './jwtAuth.guard';
import { SECRET_JWT } from './jwtConst';

@Module({
  imports: [
    JwtModule.register({
      secret: SECRET_JWT,
    }),
  ],
  providers: [JwtGuard],
  exports: [JwtModule],
})
export class AuthModule {}
