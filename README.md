# 📅 Aplicativo de Gestão de Eventos

Aplicação web full stack para **gestão de eventos**, permitindo **criar, editar, excluir e visualizar eventos** em diferentes formatos:

- **Calendário (Mensal, Semanal, Diário)**
- **Lista cronológica**

O projeto está dividido em duas partes:  
- **Frontend:** React + TypeScript + Vite 
- **Backend:** NestJS + Node.js + banco de dados relacional (PostgreSQL, mas pode ser adaptado) 

Versão de produção: https://app-gestao-de-eventos-front.vercel.app

---

## 🚀 Tecnologias utilizadas

### Frontend
- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) (Bibliotecas para interface e desenvolvimento)
- [TypeScript](https://www.typescriptlang.org/) (Superset Javascript para tipagem estática)
- [Tailwind CSS](https://tailwindcss.com/)  (Framework de utilitários de estilização)
- [Framer Motion](https://www.framer.com/motion/)  (Biblioteca de animações)
- [Lucide React](https://lucide.dev/)  (Ícones customizáveis)
- [date-fns](https://date-fns.org/)  (Utilitários para formatação de datas)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)  (API nativa do navegador para transcrever comandos de voz)

### Backend
- [NestJS](https://nestjs.com/) (Node.js Framework)
- [Prisma](https://www.prisma.io/) (ORM)
- [PostgreSQL](https://www.postgresql.org/) (Banco de dados)
- [JWT](https://www.npmjs.com/package/jsonwebtoken) + [Passport](http://www.passportjs.org/) (Autenticação)
- [bcrypt](https://www.npmjs.com/package/bcrypt) (Hash de senhas)
- [class-validator](https://docs.nestjs.com/techniques/validation) (Validação de DTOs)
- [OpenAI API](https://platform.openai.com/docs/api-reference/introduction)  (Serviço de IA para interpretar prompts do usuário)
- [chrono-node](https://www.npmjs.com/package/chrono-node)  (Biblioteca de parsing de datas em linguagem natural)

---


## 🧠 Criando Eventos com IA e Comando por Voz

O aplicativo permite criar eventos automaticamente usando **inteligência artificial** a partir de **texto** ou **voz**.  

### ✍️ 1. Criar evento via texto
- Digite a descrição do evento no campo **"Criar evento via IA..."** no topo do calendário.  
- Exemplo de prompt:
  > Agendar reunião com a equipe na próxima terça-feira das 14h às 15h
- Clique no botão **➡️ Enviar** para que a IA interprete o texto e crie o evento automaticamente.

### 🎙️ 2. Criar evento via voz
- Clique no botão de **microfone 🎤** ao lado do campo de IA.  
- Fale o comando ou descrição do evento.  
- Ao fim da fala, o evento será criado **automaticamente** sem precisar clicar no botão de enviar.
- Exemplo de comando de voz:
  > Marcar call com os diretores na segunda-feira das 10 às 11

### ⚠️ Limites diários
- Cada usuário pode fazer **até 10 requisições diárias** à IA.  
- Caso o limite seja atingido, um alerta será exibido informando que **não é possível criar mais eventos via IA** naquele dia.

💡 **Dica:** Use frases naturais como "reunião amanhã às 14h" ou "call com a equipe na sexta-feira das 10h às 11h" para que a IA interprete corretamente o evento.

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
OPENAI_API_KEY=sua_key_para_api_da_openai
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
Crie uma variável de ambiente .env na pasta frontend:
```txt
VITE_API_BASE_URL=http://localhost:3000
```

Inicializar o servidor:
```cmd
npm run dev
```

O frontend estará em 👉 http://localhost:5173

---

## 🛠️ Funcionalidades

- ✅ Criar, editar e excluir evento (título, descrição, local, início, fim)

- ✅ Criação de evento por comando de voz e inteligência artificial

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

- ⚪ Ajustes pontuais



## 👨‍💻 Autor

Desenvolvido por André Goulart Costa
📧 andre_costa117@hotmail.com
