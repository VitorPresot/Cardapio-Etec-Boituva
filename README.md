# Cardápio Escolar - ETEC Boituva 🍽️
<div align="center">

Sistema moderno e responsivo para exibição e gerenciamento do cardápio escolar da **ETEC Boituva** (Centro Paula Souza), adaptado do código original em Laravel Blade/PHP para **Next.js (React) + Bootstrap 5**, totalmente pronto para deploy gratuito e instantâneo na **Vercel**.
# 🥗 Cardápio Escolar • ETEC Boituva

---
### *Alimentação escolar planejada, saudável e transparente para a comunidade estudantil.*

## ✨ Funcionalidades
[![Deploy with Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Next.js 14](https://img.shields.io/badge/Next.js-14_App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React 18](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Bootstrap 5](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

- **📱 Página Pública do Cardápio (`/`)**:
  - Visual idêntico ao design oficial com paleta de cores institucional da ETEC.
  - Abas inteligentes para alternar entre **Semana Atual**, **Próxima Semana** ou **Ver Ambas**.
  - Detalhamento de cada refeição (Segunda a Sexta): Merenda principal, Salada fresca e Fruta do dia com ícones representativos.
  - Tabela de **Composição Nutricional Semanal** (Energia em kcal, Carboidratos, Proteínas e Lipídios com percentual % VET).
  - Totalmente responsivo para celulares, tablets e computadores.
<br />

- **🔒 Painel Administrativo (`/admin`)**:
  - Protegido por autenticação com e-mail institucional e senha.
  - Gerenciamento completo da **Semana Atual** e da **Próxima Semana**.
  - Edição de datas, número da semana e status.
  - Edição completa de cada dia da semana (merenda, salada, fruta, data e dia).
  - Possibilidade de adicionar novos dias (ex: sábado letivo) ou remover dias.
  - Edição dos valores nutricionais médios e cálculos de % VET.
  - **Recurso de Duplicação Rápida**: botão para copiar o cardápio da semana atual diretamente para a próxima semana com um clique.
  - **Restaurar Padrão**: recupera o cardápio modelo de exemplo caso necessário.
<p align="center">
  Uma plataforma web moderna, vibrante e acessível criada para conectar alunos, professores e nutricionistas ao cardápio diário da <b>ETEC Boituva (Centro Paula Souza)</b>. O sistema oferece visualização do planejamento de até <b>4 semanas</b> e um painel de controle administrativo completo.
</p>

- **⚡ Compatibilidade e Otimização para Vercel**:
  - Desenvolvido em Next.js com App Router.
  - Camada de persistência híbrida: API Routes (`/api/menu`) com fallback e sincronização automática via `localStorage`, garantindo que edições salvas no admin persistam no navegador imediatamente sem requerer a configuração de bancos pagos.
  - Suporte simplificado para bancos externos (Postgres, Supabase, Neon) se desejado no futuro.
[✨ Demonstração](#-destaques-do-projeto) • [🎯 Proposta](#-sobre-o-projeto) • [⚙️ Recursos](#-funcionalidades) • [🚀 Começar](#-início-rápido)

</div>

---

## 🛠️ Tecnologias Utilizadas
## 💡 Sobre o Projeto

- **Next.js 14** (App Router & React Server Components)
- **React 18**
- **TypeScript**
- **Bootstrap 5.3**
- **Bootstrap Icons 1.11**
- **Google Fonts (Inter)**
A merenda escolar desempenha papel fundamental no desenvolvimento cognitivo, energia e bem-estar dos estudantes. Com foco em **acessibilidade**, **transparência nutricional** e **usabilidade**, o projeto modernizou uma base legada em PHP/Blade transformando-a em uma Single-Page Application (SPA/SSR) com **Next.js 14**, **Bootstrap 5** e estilização contemporânea com paleta institucional (verdes nobres, detalhes em vermelho vibrante e tons neutros elegantes).

O projeto é 100% autossuficiente e projetado para implantação com **um clique na Vercel**, sem exigir contratação de serviços adicionais para estar operacional.

---

## 🚀 Como Executar Localmente
## 🌟 Destaques do Projeto

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
┌────────────────────────────────────────────────────────────────────────┐
│  🍲 ETEC BOITUVA • CARDÁPIO DA SEMANA                                  │
├────────────────────────────────────────────────────────────────────────┤
│  [Semana 1 (Atual)]   [Semana 2]   [Semana 3]   [Semana 4]   [Ver Todas]│
├────────────────────────────────────────────────────────────────────────┤
│  📅 Segunda-feira    📅 Terça-feira    📅 Quarta-feira    📅 Quinta... │
│  Merenda balanceada  Grelhado & Ervas  Macarrão Bolonhesa  Lombo & Leg.│
│  🥗 Alface e Tomate  🥗 Repolho Roxo   🥗 Mix de Folhas    🥗 Beterraba│
│  🍎 Banana Prata     🍎 Maçã Gala      🍊 Laranja Pera     🍊 Tangerina│
├────────────────────────────────────────────────────────────────────────┤
│  ⚡ COMPOSIÇÃO NUTRICIONAL SEMANAL                                     │
│  Energia: 685 kcal | Carboidratos: 54% VET | Proteínas: 21% VET        │
└────────────────────────────────────────────────────────────────────────┘
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o cardápio.
---

## ✨ Funcionalidades Principais

### 🎓 Para os Alunos e Responsáveis
- **Visualização Clara e Interativa**: Acompanhamento do prato principal, salada fresca e fruta da estação para cada dia da semana.
- **Planejamento Mensal (Até 4 Semanas)**: Navegação simples entre a Semana Atual, 2ª, 3ª e 4ª semana, permitindo saber previamente as refeições programadas.
- **Transparência Nutricional Completa**: Valores médios semanais de energia (kcal), carboidratos, proteínas e lipídios com o respectivo Valor Energético Total (% VET).
- **Design Adaptativo e Rápido**: Interface suave otimizada para smartphones, tablets e notebooks, com animações elegantes e visual acolhedor.

### 🛡️ Para a Gestão Escolar e Nutricionistas (Painel `/admin`)
- **Autenticação Segura**: Acesso restrito via credenciais institucionais configuráveis.
- **Gestão Abrangente das 4 Semanas**: Controle individual de cada período letivo, datas limites e status da semana ativa.
- **Editor Diário de Refeições**: Edição simples dos componentes da refeição, permitindo adicionar dias especiais (ex: sábados letivos) ou ajustar porções.
- **Duplicação Inteligente**: Botão de cópia rápida de cardápios entre semanas para acelerar o planejamento da nutricionista.
- **Persistência Imediata**: As edições são salvas automaticamente na nuvem e sincronizadas com o navegador em tempo real.

---

## 🔑 Acesso Administrativo
## 🎨 Identidade Visual e Experiência

Para acessar o painel de gerenciamento, acesse a rota `/admin` ou clique no botão **"Painel Admin"** no cabeçalho.
- **Verde Institucional ETEC**: Transmite frescor, sustentabilidade e nutrição de qualidade.
- **Acentos em Vermelho Vivo**: Destaques calorosos em elementos de energia, frutas e ações prioritárias.
- **Cinzas e Contrastes Modernos**: Tipografia limpa baseada na fonte *Inter*, proporcionando leitura confortável e sem fadiga visual.
- **Fundo com Sutis Animações Fluidas**: Microinterações que trazem dinamismo sem interferir na leitura.

- **E-mail padrão**: `admin@etec.sp.gov.br`
- **Senha padrão**: `etec123`
---

Você pode alterar essas credenciais configurando as seguintes variáveis no arquivo `.env.local` ou no painel da Vercel:
## 🛠️ Stack Tecnológica

```env
ADMIN_EMAIL=seu_email@etec.sp.gov.br
ADMIN_PASSWORD=sua_senha_segura
```
| Camada | Tecnologia | Benefício |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | Renderização híbrida ultra veloz e deploy otimizado na Vercel |
| **Linguagem** | TypeScript 5 | Tipagem estrita baseada nas entidades originais do sistema |
| **Interface** | React 18 & Bootstrap 5 | Componentes modulares, acessíveis e responsivos |
| **Ícones** | Bootstrap Icons 1.11 | Comunicação visual intuitiva |
| **Estilização** | CSS3 Moderno + Micro-animações | Estética contemporânea e identidade visual customizada |

---

## ☁️ Como Fazer Deploy na Vercel
## 🚀 Início Rápido

O projeto foi configurado com zero-configuração necessária para a Vercel:
### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- npm ou yarn

1. Suba o código para o seu repositório GitHub (`git push`).
2. Acesse [vercel.com](https://vercel.com) e conecte sua conta do GitHub.
3. Clique em **"Add New Project"** e selecione o repositório **Cardapio-Etec-Boituva**.
4. (Opcional) Adicione as variáveis de ambiente `ADMIN_EMAIL` e `ADMIN_PASSWORD` na aba **Environment Variables**.
5. Clique em **Deploy**! Em menos de 1 minuto seu cardápio estará online com certificado SSL gratuito.
### Executando o projeto

---
```bash
# 1. Clone o repositório
git clone https://github.com/VitorPresot/Cardapio-Etec-Boituva.git

## 📂 Estrutura das Pastas
# 2. Acesse a pasta
cd Cardapio-Etec-Boituva

# 3. Instale as dependências
npm install

# 4. Inicie o ambiente de desenvolvimento
npm run dev
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

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

Para acessar o painel administrativo:
- Rota: `/admin`
- E-mail padrão: `admin@etec.sp.gov.br`
- Senha padrão: `etec123`

---

## 📜 Licença
## ☁️ Publicação na Vercel

Desenvolvido para a comunidade da **ETEC Boituva**.
Distribuído sob a licença MIT.
O projeto foi configurado no padrão **zero-config** para a Vercel:
1. Faça o fork ou clone do repositório no seu GitHub.
2. No painel da [Vercel](https://vercel.com), clique em **Add New Project**.
3. Selecione o repositório e clique em **Deploy**.
4. Pronto! O projeto estará disponível mundialmente via CDN com HTTPS automático.

---

<div align="center">
  <p><b>Desenvolvido com dedicação para a comunidade da ETEC Boituva • Centro Paula Souza</b></p>
  <sub>Distribuído sob a licença MIT.</sub>
</div>