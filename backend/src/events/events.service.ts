import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Prisma, Event } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Omit<Prisma.EventCreateInput, 'user'> & { userId?: number }
  ): Promise<Event> {
    const userId = data.userId;
    if (!userId) throw new ForbiddenException('Usuário não autenticado');

    const { userId: _, ...eventData } = data; // remove userId enviado pelo cliente
    return this.prisma.event.create({
      data: {
        ...eventData,
        user: { connect: { id: userId } },
      },
    });
  }

  async findAllByUser(userId: number): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: { userId },
      include: { user: true },
      orderBy: { startDate: 'asc' },
    });
  }

  async findOneByUser(id: string, userId: number): Promise<Event> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!event) throw new NotFoundException('Evento não encontrado');
    if (event.userId !== userId) throw new ForbiddenException('Acesso negado');

    return event;
  }

  /** Atualiza um evento garantindo que pertence ao usuário e não altera userId */
  async updateByUser(
    id: string,
    userId: number,
    data: Prisma.EventUpdateInput
  ): Promise<Event> {
    await this.findOneByUser(id, userId); // valida acesso

    // remove userId caso enviado no DTO para evitar sobrescrita
    const { userId: _, ...safeData } = data as any;

    return this.prisma.event.update({
      where: { id },
      data: safeData,
    });
  }

  /** Remove um evento garantindo que pertence ao usuário */
  async removeByUser(id: string, userId: number): Promise<Event> {
    await this.findOneByUser(id, userId); // valida acesso
    return this.prisma.event.delete({ where: { id } });
  }
}