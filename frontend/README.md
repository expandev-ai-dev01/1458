# TODO List - Sistema de Gerenciamento de Tarefas

## Descrição

Sistema de gerenciamento de tarefas com funcionalidades completas para organização e produtividade.

## Tecnologias

- React 19.2.0
- TypeScript 5.9.3
- Vite 7.1.9
- TailwindCSS 3.4.14
- React Router DOM 7.9.3
- TanStack Query 5.90.2
- Axios 1.12.2
- React Hook Form 7.63.0
- Zod 4.1.11

## Estrutura do Projeto

```
src/
├── app/                    # Configuração da aplicação
│   ├── main.tsx           # Entry point
│   ├── App.tsx            # Componente raiz
│   ├── router.tsx         # Configuração de rotas
│   └── providers.tsx      # Providers globais
├── core/                   # Componentes e lógica compartilhada
│   ├── components/        # Componentes genéricos
│   ├── lib/              # Configurações de bibliotecas
│   ├── types/            # Tipos globais
│   ├── constants/        # Constantes globais
│   └── utils/            # Funções utilitárias
├── domain/                # Domínios de negócio
├── pages/                 # Páginas da aplicação
│   ├── layouts/          # Layouts compartilhados
│   ├── Home/             # Página inicial
│   └── NotFound/         # Página 404
└── assets/               # Recursos estáticos
    └── styles/           # Estilos globais
```

## Configuração

1. Instalar dependências:
```bash
npm install
```

2. Configurar variáveis de ambiente:
```bash
cp .env.example .env
```

3. Iniciar servidor de desenvolvimento:
```bash
npm run dev
```

## Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa linter

## Funcionalidades Planejadas

1. Criação de Tarefas
2. Categorização de Tarefas
3. Definição de Prioridades
4. Estabelecimento de Prazos
5. Marcação de Conclusão
6. Busca de Tarefas
7. Notificações e Lembretes
8. Compartilhamento de Tarefas
9. Visualização em Calendário
10. Sincronização Multiplataforma

## Arquitetura

O projeto segue uma arquitetura modular baseada em domínios:

- **Domain-Driven**: Cada funcionalidade de negócio em seu próprio domínio
- **Component-Based**: Componentes reutilizáveis e isolados
- **Type-Safe**: TypeScript em modo strict
- **API Integration**: Separação entre endpoints públicos e autenticados

## Padrões de Código

- Componentes funcionais com hooks
- TypeScript strict mode
- JSDoc para documentação
- Tailwind CSS para estilização
- React Query para gerenciamento de estado do servidor
- React Hook Form + Zod para formulários

## Contribuição

Este é um projeto base pronto para receber implementações de features.

## Licença

Private