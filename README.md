# Mini Twitter

Aplicação de microblog desenvolvida com Next.js, onde usuários podem se cadastrar, publicar posts com imagens, curtir e interagir com conteúdos de outros usuários.

## Tecnologias

| Tecnologia                | Uso                              |
| ------------------------- | -------------------------------- |
| **Next.js 16**            | Framework principal (App Router) |
| **TypeScript**            | Tipagem estática                 |
| **Tailwind CSS 4**        | Estilização e responsividade     |
| **React Hook Form + Zod** | Formulários e validação          |
| **TanStack Query**        | Cache e estado do servidor       |
| **Axios**                 | Requisições HTTP                 |
| **Zustand**               | Estado global (auth, likes)      |
| **Sonner**                | Notificações toast               |
| **next-themes**           | Modo dark/light                  |
| **Vitest + RTL**          | Testes unitários                 |
| **Cypress**               | Testes E2E                       |

## Funcionalidades

### Autenticação

- Cadastro com nome, e-mail e senha
- Login com e-mail e senha — token JWT armazenado no `localStorage`
- Auto-login após o cadastro
- Logout com limpeza completa da sessão

### Posts

- Timeline pública com scroll infinito (sem necessidade de paginação manual)
- Busca de posts por título/conteúdo com debounce
- Criação de posts com título, conteúdo e imagem opcional (limite de 5MB)
- Edição e exclusão dos próprios posts
- Botões de editar/deletar visíveis apenas para o autor do post

### Interação

- Curtir e descurtir posts (usuários autenticados)
- Contador de likes visível para todos, incluindo visitantes
- Estado de "curtido" persistido no `localStorage` por usuário — mantém o estado entre recarregamentos

### UX

- Modo dark/light com alternância via toggle
- Feedbacks de erro via toast (credenciais inválidas, 403, falhas de rede)
- Estados de loading nos botões durante operações assíncronas
- Responsivo para mobile e desktop

## Pré-requisitos

- Backend do Mini Twitter rodando em `http://localhost:3000`
- Docker (opção recomendada) **ou** Node.js 20+

## Rodando o projeto

### Opção 1 — Docker (recomendado)

```bash
git clone https://github.com/AOBarbosa/mini-twitter-b2bit.git
cd mini-twitter

docker build \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:3000 \
  -t mini-twitter .

docker run -p 3001:3001 mini-twitter
```

A aplicação estará disponível em (http://localhost:3001).

### Opção 2 — Localmente

```bash
git clone https://github.com/AOBarbosa/mini-twitter-b2bit.git
cd mini-twitter

cp .env.example .env.local
npm install
npm run dev
```

A aplicação estará disponível em [http://localhost:3001](http://localhost:3001).

## Scripts disponíveis

```bash
npm run dev        # Servidor de desenvolvimento (porta 3001)
npm run build      # Build de produção
npm run start      # Inicia o build de produção
npm run lint       # Lint do código
npm run test       # Testes unitários em modo watch
npm run test:run   # Testes unitários (execução única)
npm run e2e        # Abre o Cypress (interface gráfica)
npm run e2e:run    # Executa os testes E2E no terminal
```

## Testes

### Unitários (Vitest + React Testing Library)

Cobrem schemas de validação, componentes de formulário e hooks de autenticação.

```bash
npm run test:run
```

### E2E (Cypress)

Cobrem os fluxos completos de login, cadastro, logout e CRUD de posts.

> O frontend (`localhost:3001`) e o backend (`localhost:3000`) precisam estar rodando.

```bash
npm run e2e
```

## Estrutura do projeto

```
src/
├── app/
│   ├── (auth)/login/     # Página de login e cadastro
│   ├── feed/             # Timeline principal
│   └── layout.tsx        # Layout raiz com providers
├── components/
│   ├── feed/             # CreatePostForm, PostCard, FeedHeader
│   ├── forms/            # LoginForm, RegisterForm
│   ├── layout/           # AuthHydrator, ThemeProvider, QueryProvider
│   └── ui/               # Componentes base (Button, Input, etc.)
├── hooks/                # useLogin, usePosts, useLikePost, etc.
├── services/             # auth.service, post.service (chamadas à API)
├── store/                # authStore, likedPostsStore (Zustand)
├── schemas/              # Schemas Zod (login, register, post)
└── types/                # Interfaces TypeScript (User, Post, etc.)
```
