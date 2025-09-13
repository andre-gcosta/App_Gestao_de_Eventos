# 📅 Aplicativo de Gestão de Eventos

Aplicação web full stack para **gestão de eventos**, permitindo **criar, editar, excluir e visualizar eventos** em diferentes formatos:

- **Calendário (Mensal, Semanal, Diário)**
- **Lista cronológica**

O projeto está dividido em duas partes:  
- **Frontend:** React + TypeScript + Vite 
- **Backend:** NestJS + Node.js + banco de dados relacional (PostgreSQL, mas pode ser adaptado)  


---

## 🚀 Tecnologias utilizadas

### Frontend
- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)  
- [Framer Motion](https://www.framer.com/motion/)  
- [Lucide React](https://lucide.dev/)  
- [date-fns](https://date-fns.org/)  
### Backend
- [NestJS](https://nestjs.com/) (Node.js Framework)
- [Prisma](https://www.prisma.io/) (ORM)
- [PostgreSQL](https://www.postgresql.org/) (Banco de dados)
- [JWT](https://www.npmjs.com/package/jsonwebtoken) + [Passport](http://www.passportjs.org/) (Autenticação)
- [bcrypt](https://www.npmjs.com/package/bcrypt) (Hash de senhas)
- [class-validator](https://docs.nestjs.com/techniques/validation) (Validação de DTOs)

---

## ⚙️ Como rodar o projeto

### 1. Pré-requisitos
- Node.js 18+
- PostgreSQL (ou outro banco relacional)
- NPM ou Yarn

### 2. Banco de dados

Acesse o terminal do PostgreSQL:
```psql
psql -U postgres
```
Crie o banco:
```sql
CREATE DATABASE app_gestao_de_eventos;
```

### 3. Backend

Entre na pasta raiz do backend:
```cmd
cd backend
```

Instalar dependências:
```cmd
npm install
```

Crie uma variável de ambiente .env na pasta backend:
```txt
DATABASE_URL=postgresql://<usuario>:<senha>@localhost:5432/app_gestao_de_eventos
JWT_SECRET=crie_um_secret_seguro!
```

Gerar Prisma e criar migration:
```cmd
npx prisma generate
npx prisma migrate dev --name init
```

Inicializar o servidor:
```cmd
npm run start
```

O backend estará em 👉 http://localhost:3000

Endpoints principais:

- GET /events – listar eventos

- POST /events – criar evento

- PUT /events/:id – editar evento

- DELETE /events/:id – excluir evento


### 4. Frontend

Entre na pasta raiz do frontend:
```cmd
cd frontend
```

Instalar dependências:
```cmd
npm install
```

Inicializar o servidor:
```cmd
npm run dev
```

O frontend estará em 👉 http://localhost:5173

---

## 🛠️ Funcionalidades

- ✅ Criar, editar e excluir evento (título, descrição, local, início, fim)

- ✅ Visualização em formato Calendário (Mês, Semana, Dia)

- ✅ Visualização em formato Lista cronológica e agrupamento por mês

- ✅ Integração completa com backend (CRUD via API REST)

- ✅ Autenticação de usuário com JWT

- ✅ Responsividade (desktop e mobile)

- ✅ Cards de evento de tamanho proporcional a duração e destaques no horário atual, preenchimento automatico de datas dependendo do contexto

- ✅ Interface intuitiva com animações suaves (Framer Motion)

- ✅ Organização em hooks customizados e componentes reutilizáveis


### **Próximos passos:**

- ⚪ Testes automatizados (unitários e integração)

- ⚪ Melhorias em acessibilidade (teclado/ARIA)

- ⚪ Deploy

- ⚪ Ajustes pontuais



## 👨‍💻 Autor

Desenvolvido por André Goulart Costa
📧 andre_costa117@hotmail.com
