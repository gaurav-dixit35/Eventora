import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
  imports: [ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]), AuthModule, EventsModule],
})
export class AppModule {}
