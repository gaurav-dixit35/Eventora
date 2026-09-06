import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { ForgotPasswordDto, LoginDto, ResetPasswordDto, SignupDto } from './dto';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import type { AuthenticatedUser } from './types';

const sessionCookie = (response: Response, token: string): void => {
  response.cookie('eventora_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
};

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('signup')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async signup(
    @Body() input: SignupDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ user: AuthenticatedUser }> {
    const user = await this.auth.signup(input);
    sessionCookie(response, await this.auth.issueSession(user));
    return { user };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async login(
    @Body() input: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ user: AuthenticatedUser }> {
    const user = await this.auth.login(input.email, input.password);
    sessionCookie(response, await this.auth.issueSession(user));
    return { user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Res({ passthrough: true }) response: Response): void {
    response.clearCookie('eventora_session', { httpOnly: true, sameSite: 'lax', path: '/' });
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async me(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ user: { id: string; name: string; email: string; roles: string[] } }> {
    return { user: await this.auth.getUser(user.id) };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.ACCEPTED)
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  async forgotPassword(@Body() input: ForgotPasswordDto): Promise<{ message: string }> {
    const token = await this.auth.createResetToken(input.email);
    if (token && process.env.NODE_ENV !== 'production')
      console.info(`DEV password reset token for ${input.email}: ${token}`);
    return { message: 'If an account exists, password reset instructions have been sent.' };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  async resetPassword(@Body() input: ResetPasswordDto): Promise<void> {
    await this.auth.resetPassword(input.token, input.password);
  }

  @Post('google/callback')
  @HttpCode(HttpStatus.NOT_IMPLEMENTED)
  googleCallback(): { message: string } {
    return {
      message:
        'Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable it.',
    };
  }

  @Get('admin-check')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  adminCheck(): { authorized: true } {
    return { authorized: true };
  }
}
