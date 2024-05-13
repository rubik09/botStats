import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  private authHeaderSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.authHeaderSecret = this.configService.getOrThrow('AUTH_HEADER_SECRET');
  }

  canActivate(context: ExecutionContext): boolean {
    const { headers } = context.switchToHttp().getRequest();

    return headers.auth === this.authHeaderSecret;
  }
}
