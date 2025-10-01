import { Controller, Post, Body, Request, UnauthorizedException, ForbiddenException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiService } from './ai.service';
import { PrismaService } from 'src/prisma/prisma.service';

@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly prisma: PrismaService,
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
}