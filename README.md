# Cardápio Escolar - ETEC Boituva 🍽️

Sistema moderno e responsivo para exibição e gerenciamento do cardápio escolar da **ETEC Boituva** (Centro Paula Souza), adaptado do código original em Laravel Blade/PHP para **Next.js (React) + Bootstrap 5**, totalmente pronto para deploy gratuito e instantâneo na **Vercel**.

---

## ✨ Funcionalidades

- **📱 Página Pública do Cardápio (`/`)**:
  - Visual idêntico ao design oficial com paleta de cores institucional da ETEC.
  - Abas inteligentes para alternar entre **Semana Atual**, **Próxima Semana** ou **Ver Ambas**.
  - Detalhamento de cada refeição (Segunda a Sexta): Merenda principal, Salada fresca e Fruta do dia com ícones representativos.
  - Tabela de **Composição Nutricional Semanal** (Energia em kcal, Carboidratos, Proteínas e Lipídios com percentual % VET).
  - Totalmente responsivo para celulares, tablets e computadores.

- **🔒 Painel Administrativo (`/admin`)**:
  - Protegido por autenticação com e-mail institucional e senha.
  - Gerenciamento completo da **Semana Atual** e da **Próxima Semana**.
  - Edição de datas, número da semana e status.
  - Edição completa de cada dia da semana (merenda, salada, fruta, data e dia).
  - Possibilidade de adicionar novos dias (ex: sábado letivo) ou remover dias.
  - Edição dos valores nutricionais médios e cálculos de % VET.
  - **Recurso de Duplicação Rápida**: botão para copiar o cardápio da semana atual diretamente para a próxima semana com um clique.
  - **Restaurar Padrão**: recupera o cardápio modelo de exemplo caso necessário.

- **⚡ Compatibilidade e Otimização para Vercel**:
  - Desenvolvido em Next.js com App Router.
  - Camada de persistência híbrida: API Routes (`/api/menu`) com fallback e sincronização automática via `localStorage`, garantindo que edições salvas no admin persistam no navegador imediatamente sem requerer a configuração de bancos pagos.
  - Suporte simplificado para bancos externos (Postgres, Supabase, Neon) se desejado no futuro.

---

## 🛠️ Tecnologias Utilizadas

- **Next.js 14** (App Router & React Server Components)
- **React 18**
- **TypeScript**
- **Bootstrap 5.3**
- **Bootstrap Icons 1.11**
- **Google Fonts (Inter)**

---

## 🚀 Como Executar Localmente

### 1. Pré-requisitos
- Node.js versão 18+ ou superior instalada.
- npm ou yarn.

### 2. Instalar dependências
```bash
npm install
```

### 3. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o cardápio.

---

## 🔑 Acesso Administrativo

Para acessar o painel de gerenciamento, acesse a rota `/admin` ou clique no botão **"Painel Admin"** no cabeçalho.

- **E-mail padrão**: `admin@etec.sp.gov.br`
- **Senha padrão**: `etec123`

Você pode alterar essas credenciais configurando as seguintes variáveis no arquivo `.env.local` ou no painel da Vercel:

```env
ADMIN_EMAIL=seu_email@etec.sp.gov.br
ADMIN_PASSWORD=sua_senha_segura
```

---

## ☁️ Como Fazer Deploy na Vercel

O projeto foi configurado com zero-configuração necessária para a Vercel:

1. Suba o código para o seu repositório GitHub (`git push`).
2. Acesse [vercel.com](https://vercel.com) e conecte sua conta do GitHub.
3. Clique em **"Add New Project"** e selecione o repositório **Cardapio-Etec-Boituva**.
4. (Opcional) Adicione as variáveis de ambiente `ADMIN_EMAIL` e `ADMIN_PASSWORD` na aba **Environment Variables**.
5. Clique em **Deploy**! Em menos de 1 minuto seu cardápio estará online com certificado SSL gratuito.

---

## 📂 Estrutura das Pastas

```
├── public/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── login/
│   │   │   │   └── page.tsx        # Tela de login do admin
│   │   │   └── page.tsx            # Painel admin de gerenciamento
│   │   ├── api/
│   │   │   ├── auth/route.ts       # Endpoint de autenticação
│   │   │   └── menu/route.ts       # Endpoint GET e POST do cardápio
│   │   ├── globals.css             # Estilos fiéis ao template Blade
│   │   ├── layout.tsx              # Layout base com Bootstrap & Icons
│   │   └── page.tsx                # Página pública do Cardápio
│   ├── components/
│   │   ├── Footer.tsx              # Rodapé
│   │   ├── Hero.tsx                # Banner de destaque
│   │   ├── MealCard.tsx            # Card de merenda/salada/fruta
│   │   ├── Navbar.tsx              # Barra de navegação institucional
│   │   ├── NutritionCard.tsx       # Tabela nutricional e % VET
│   │   └── WeekCard.tsx            # Agrupamento semanal
│   ├── data/
│   │   └── initialData.ts          # Cardápios padrão pré-cadastrados
│   ├── lib/
│   │   ├── auth.ts                 # Autenticação de sessão
│   │   └── storage.ts              # Utilitários de persistência e datas
│   └── types/
│       └── menu.ts                 # Modelos Week, Meal, NutritionInfo, User
├── package.json
└── tsconfig.json
```

---

## 📜 Licença

Desenvolvido para a comunidade da **ETEC Boituva**.
Distribuído sob a licença MIT.