# Cardápio Escolar • ETEC Boituva

Aplicação web para publicação e gerenciamento do cardápio escolar da ETEC Boituva. O projeto usa Next.js 14, React 18, TypeScript, Bootstrap 5 e MongoDB.

## Funcionalidades

- Página pública com até quatro semanas de refeições e informações nutricionais.
- Painel administrativo protegido por sessão HTTP-only.
- Edição de semanas, refeições, datas e dados nutricionais.
- Duplicação, inclusão e remoção de semanas e refeições.
- Modo cíclico opcional: semanas expiradas são reposicionadas automaticamente para depois da última semana vigente, preservando a duração e os dias das refeições.
- Persistência durável em uma coleção MongoDB.
- Endpoint de cron em `/api/cron` para processar ciclos automaticamente.

## Requisitos

- Node.js 18 ou superior.
- Uma instância MongoDB local ou MongoDB Atlas.
- npm.

## Configuração

Copie o arquivo de exemplo:

```bash
cp .env.example .env.local
```

Configure as variáveis:

```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=cardapio_etec
MONGODB_COLLECTION=menu_state

ADMIN_EMAIL=admin@exemplo.com
ADMIN_PASSWORD=defina-uma-senha-forte
AUTH_SECRET=gere-um-segredo-aleatorio-com-pelo-menos-32-caracteres
CRON_SECRET=outro-segredo-aleatorio
```

O banco usa um único documento com `_id: "default"` na coleção configurada. Se o documento ainda não existir, ele é criado automaticamente com os dados iniciais. Em produção, `MONGODB_URI` é obrigatório; a aplicação não trata falhas de conexão como sucesso de gravação.

## Executando localmente

```bash
npm ci
npm run dev
```

Acesse <http://localhost:3000>. O painel administrativo fica em `/admin`.

## Produção

```bash
npm run lint
npm run build
npm start
```

No deploy, configure todas as variáveis de ambiente no provedor. Para executar o ciclo automaticamente, agende uma requisição autenticada:

```bash
curl -H "x-cron-secret: $CRON_SECRET" https://seu-dominio.example/api/cron
```

## Validação dos dados

O endpoint `POST /api/menu` valida o payload com um schema estrito antes de persistir. São validados:

- quantidade de semanas e refeições;
- IDs e campos obrigatórios;
- datas no formato `YYYY-MM-DD` e intervalo válido;
- limites numéricos nutricionais;
- percentuais VET entre 0 e 100;
- rejeição de propriedades desconhecidas.

## Estrutura

```text
src/
├── app/
│   ├── admin/              # painel e login
│   ├── api/                # autenticação, cardápio e cron
│   ├── layout.tsx
│   └── page.tsx
├── components/             # componentes da interface
├── data/                   # dados iniciais
├── lib/
│   ├── auth-server.ts      # sessão administrativa
│   ├── date-utils.ts       # datas no fuso de São Paulo
│   ├── menu-schema.ts      # schema Zod
│   ├── menu-store.ts       # ciclo e persistência
│   └── mongo.ts            # cliente MongoDB
└── types/
```

## Licença

Distribuído sob a licença MIT.
