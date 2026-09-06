import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import type { AuthenticatedUser } from './types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { cookies?: Record<string, string>; user: AuthenticatedUser }>();
    const token = request.cookies?.eventora_session;
    if (!token) throw new UnauthorizedException('Authentication is required.');
    try {
      request.user = await this.jwt.verifyAsync<AuthenticatedUser>(token);
      return true;
    } catch {
      throw new UnauthorizedException('Your session is invalid or expired.');
    }
  }
}
