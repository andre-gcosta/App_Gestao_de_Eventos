import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsService {
    constructor(private prisma: PrismaService) {}

    create(data: Prisma.EventCreateInput) {
        return this.prisma.event.create({ data });
    }

    findAll() {
        return this.prisma.event.findMany({ include: { user: true }, orderBy: { startDate: 'asc' }, });
    }

    findOne(id: string) {
        return this.prisma.event.findUnique({ where: { id }, include: { user: true } });
    }

    update(id: string, data: Prisma.EventUpdateInput) {
        return this.prisma.event.update({ where: { id }, data });
    }

    remove(id: string) {
        return this.prisma.event.delete({ where: { id } });
    }
}