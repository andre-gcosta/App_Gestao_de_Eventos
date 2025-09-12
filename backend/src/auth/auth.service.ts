import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) return null;

        const passwordMatches = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatches) return null;

        const { passwordHash, ...result } = user;
        return result;
    }

    async login(user: any) {
        const payload = { sub: user.id, email: user.email };
        return {
            accessToken: this.jwtService.sign(payload),
            user,
        };
    }

    async register(data: { name: string; email: string; password: string }) {
        const { name, email, password } = data;

        // Validação de nome
        if (!name || name.trim().length < 2) {
            throw new BadRequestException('Nome deve ter pelo menos 2 caracteres');
        }

        // Validação de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new BadRequestException('Email inválido');
        }

        // Verifica se já existe usuário
        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
            throw new ConflictException('Email já cadastrado');
        }

        // Validação de senha
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{};':"\\|,.<>/?-]).{8,}$/;
        if (!passwordRegex.test(password)) {
            throw new BadRequestException(
                'Senha deve ter pelo menos 8 caracteres, 1 letra maiúscula, 1 número e 1 caractere especial'
            );
        }

        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cria o usuário
        const user = await this.usersService.create({
            name,
            email,
            passwordHash: hashedPassword,
        });

        // Retorna token
        return this.login(user);
    }
}
