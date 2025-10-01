import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AiModule } from './ai/ai.module';
import { RateLimiterModule } from 'nestjs-rate-limiter';

@Module({
  imports: [EventsModule, UsersModule, PrismaModule, AuthModule, AiModule,
    RateLimiterModule.register({
      points: 10, // 10 requests
      duration: 60, // por 60 segundos
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}