import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { RolesGuard } from './roles.guard';
import { PrismaService } from '../prisma/prisma.service';

const authSecret = process.env.AUTH_SECRET;
if (!authSecret) throw new Error('AUTH_SECRET must be configured before the API starts.');

@Module({
  imports: [JwtModule.register({ secret: authSecret })],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, RolesGuard, PrismaService],
  exports: [AuthGuard, RolesGuard, PrismaService],
})
export class AuthModule {}
