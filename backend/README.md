# TODO List - Backend API

Sistema de gerenciamento de tarefas - API REST

## Tecnologias

- Node.js
- TypeScript
- Express.js

## Estrutura do Projeto

```
src/
├── api/              # API controllers
├── routes/           # Route definitions
├── middleware/       # Express middleware
├── services/         # Business logic
├── utils/            # Utility functions
├── constants/        # Application constants
├── instances/        # Service instances
└── server.ts         # Application entry point
```

## Instalação

```bash
npm install
```

## Configuração

1. Copie o arquivo `.env.example` para `.env`
2. Configure as variáveis de ambiente necessárias

## Desenvolvimento

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Produção

```bash
npm start
```

## Testes

```bash
npm test
```

## Lint

```bash
npm run lint
npm run lint:fix
```

## API Endpoints

### Health Check
- `GET /health` - Verifica o status da API

### API v1
- Base URL: `/api/v1`
- External routes: `/api/v1/external`
- Internal routes: `/api/v1/internal`

## Licença

ISC