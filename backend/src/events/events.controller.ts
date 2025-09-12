import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { EventsService } from './events.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Request() req: any, @Body() createEventDto: Omit<Prisma.EventCreateInput, 'user'>) {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedException('Usuário não autenticado');
    return this.eventsService.create({ ...createEventDto, userId });
  }

  @Get()
  findAll(@Request() req: any) {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedException('Usuário não autenticado');
    return this.eventsService.findAllByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedException('Usuário não autenticado');
    return this.eventsService.findOneByUser(id, userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateEventDto: Prisma.EventUpdateInput, @Request() req: any) {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedException('Usuário não autenticado');
    return this.eventsService.updateByUser(id, userId, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedException('Usuário não autenticado');
    return this.eventsService.removeByUser(id, userId);
  }
}
