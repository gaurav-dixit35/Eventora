import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthenticatedUser } from './types';
import type { SignupDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async signup(input: SignupDto): Promise<AuthenticatedUser> {
    const email = input.email.toLowerCase();
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { phone: input.phone }] },
      select: { id: true },
    });
    if (existing)
      throw new ConflictException('An account with that email or phone already exists.');
    const passwordHash = await hash(input.password, 12);
    const attendeeRole = await this.prisma.role.findUnique({ where: { name: 'ATTENDEE' } });
    if (!attendeeRole) throw new Error('ATTENDEE role is not initialized. Run the database seed.');
    const user = await this.prisma.user.create({
      data: {
        name: input.name.trim(),
        email,
        phone: input.phone,
        passwordHash,
        roles: { create: { roleId: attendeeRole.id } },
      },
      select: { id: true, email: true, roles: { select: { role: { select: { name: true } } } } },
    });
    return { id: user.id, email: user.email, roles: user.roles.map((entry) => entry.role.name) };
  }

  async login(emailInput: string, password: string): Promise<AuthenticatedUser> {
    const user = await this.prisma.user.findUnique({
      where: { email: emailInput.toLowerCase() },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        status: true,
        roles: { select: { role: { select: { name: true } } } },
      },
    });
    if (
      !user ||
      !user.passwordHash ||
      user.status !== 'ACTIVE' ||
      !(await compare(password, user.passwordHash))
    ) {
      throw new UnauthorizedException('Invalid email or password.');
    }
    return { id: user.id, email: user.email, roles: user.roles.map((entry) => entry.role.name) };
  }

  async getUser(
    userId: string,
  ): Promise<{ id: string; name: string; email: string; roles: string[] }> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        roles: { select: { role: { select: { name: true } } } },
      },
    });
    return { ...user, roles: user.roles.map((entry) => entry.role.name) };
  }

  async createResetToken(emailInput: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: emailInput.toLowerCase() },
      select: { id: true, status: true },
    });
    if (!user || user.status !== 'ACTIVE') return null;
    return this.jwt.signAsync({ sub: user.id, purpose: 'password-reset' }, { expiresIn: '15m' });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    try {
      const payload = await this.jwt.verifyAsync<{ sub: string; purpose: string }>(token);
      if (payload.purpose !== 'password-reset') throw new Error('Wrong token purpose');
      await this.prisma.user.update({
        where: { id: payload.sub },
        data: { passwordHash: await hash(password, 12) },
      });
    } catch {
      throw new UnauthorizedException('The reset token is invalid or expired.');
    }
  }

  issueSession(user: AuthenticatedUser): Promise<string> {
    return this.jwt.signAsync(user, { expiresIn: '7d' });
  }
}
