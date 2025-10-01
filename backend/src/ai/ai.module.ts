import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [HttpModule, EventsModule],
  controllers: [AiController],
  providers: [AiService, PrismaService],
})
export class AiModule {}