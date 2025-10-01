import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [EventsService],
  controllers: [EventsController],
  imports: [PrismaModule],
  exports: [EventsService],  // necessário para injetar em AiModule
})
export class EventsModule {}

