import { Controller, Post, Body, Request, UnauthorizedException, ForbiddenException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiService } from './ai.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventsService } from '../events/events.service';

@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService,
  ) {}

  @Post('ask')
  async askAi(@Body() body: { prompt: string }, @Request() req: any) {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedException('Usuário não autenticado');

    const today = new Date().toISOString().split('T')[0];

    // Conta quantas requisições o usuário já fez hoje
    const requestsToday = await this.prisma.userRequest.count({
      where: { userId, date: today },
    });

    if (requestsToday >= 10) {
      throw new ForbiddenException('Limite diário de requisições atingido');
    }

    // Salva log da requisição
    await this.prisma.userRequest.create({
      data: { userId, date: today },
    });

    // Chama a IA
    const result = await this.aiService.generateResponse(body.prompt);

    return { response: result };
  }

  @Post('create-event')
  async createEventFromPrompt(@Body() body: { prompt: string }, @Request() req: any) {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedException('Usuário não autenticado');

    const today = new Date().toISOString().split('T')[0];

    const requestsToday = await this.prisma.userRequest.count({
      where: { userId, date: today },
    });

    if (requestsToday >= 10) {
      throw new ForbiddenException('Limite diário de requisições atingido');
    }

    await this.prisma.userRequest.create({
      data: { userId, date: today },
    });

    try {
      const eventData = await this.aiService.extractEventData(body.prompt);

      // Converte startDate e endDate para Date antes de criar no Prisma
      const createdEvent = await this.eventsService.create({
        title: eventData.title || 'Sem título',
        description: eventData.description || null,
        location: eventData.location || 'Sem local definido',
        status: eventData.status || 'scheduled',
        startDate: new Date(eventData.startDate),
        endDate: new Date(eventData.endDate),
        userId,
      });
      return { event: createdEvent };
    } catch (error) {
      throw new ForbiddenException(`Falha ao criar evento: ${error.message}`);
    }
  }
}