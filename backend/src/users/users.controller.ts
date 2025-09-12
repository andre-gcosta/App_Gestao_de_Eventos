// src/users/users.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Req() req, @Body() createUserDto: Prisma.UserCreateInput) {
        throw new ForbiddenException('Use /auth/register para criar usuários');
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        throw new ForbiddenException('Não permitido');
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string, @Req() req) {
        const userId = req.user.userId;
        if (+id !== userId) throw new ForbiddenException('Acesso negado');
        return this.usersService.findOne(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() updateUserDto: Prisma.UserUpdateInput, @Req() req) {
        const userId = req.user.userId;
        if (+id !== userId) throw new ForbiddenException('Acesso negado');
        return this.usersService.update(userId, updateUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string, @Req() req) {
        const userId = req.user.userId;
        if (+id !== userId) throw new ForbiddenException('Acesso negado');
        return this.usersService.remove(userId);
    }
}
