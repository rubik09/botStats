import { forwardRef, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AdminsModule } from "../admins/admins.module";
import { LocalStrategy } from "./jwt.strategy";
import { JwtModule } from "@nestjs/jwt";
import { SECRET_JWT } from "./jwtConst";

@Module({
  imports: [
    forwardRef(() => AdminsModule),
    JwtModule.register({
      secret: SECRET_JWT,
      signOptions: { expiresIn: "7d" },
    }),
  ],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService, LocalStrategy],
})
export class AuthModule {}
