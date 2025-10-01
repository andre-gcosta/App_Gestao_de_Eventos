import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [HttpModule],
  controllers: [AiController],
  providers: [AiService, PrismaService],
})
export class AiModule {}