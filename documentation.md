# Documentação Técnica: Plataforma Digital Acervo Hip Hop

## 1. Introdução

Este documento detalha a arquitetura, tecnologias e funcionamento da aplicação frontend desenvolvida para o Projeto Acervo Hip Hop. O objetivo é fornecer uma compreensão clara do sistema, suas funcionalidades atuais e a estrutura do código.

## 3. Tecnologias Utilizadas

Tecnologias principais:

*   **Next.js 15.2.1**: Framework React para construção de aplicações web com renderização do lado do servidor (SSR), geração de sites estáticos (SSG) e outras otimizações de performance.
*   **React 19.0.0**: Biblioteca JavaScript para construção de interfaces de usuário.
*   **Tailwind CSS**: Framework CSS utilitário que permite a criação de designs diretamente no HTML.
*   **Framer Motion**: Biblioteca para animações em React, utilizada para criar transições e movimentos fluidos na interface.
*   **Maplibre**: Biblioteca para renderização de mapas e visualização de dados geográficos.
*   **Lucide React**: Biblioteca de ícones.
*   **Radix UI**: Coleção de componentes React de baixo nível e acessíveis para construção de sistemas de design.

## 4. Arquitetura da Aplicação

A aplicação segue uma arquitetura baseada em componentes, comum em projetos React/Next.js. A estrutura de pastas `src/app` e o uso do App Router do Next.js, que organiza as rotas e layouts.

### 4.1. Estrutura de Pastas

```
frontend_app/
├── .gitignore
├── components.json
├── jsconfig.json
├── next.config.mjs
├── next-env.d.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.js
└── src/
    ├── app/                  # Rotas e layouts da aplicação (App Router)
    │   ├── acervo/           # Seção do acervo
    │   │   ├── layout.js
    │   │   └── page.js
    │   ├── audiovisual/      # Seção audiovisual
    │   │   ├── layout.js
    │   │   └── page.js
    │   ├── mapa/             # Seção do mapa
    │   │   ├── layout.js
    │   │   └── page.js
    │   ├── revista/          # Seção da revista
    │   │   ├── layout.js
    │   │   └── page.js
    │   ├── favicon.ico
    │   ├── fonts.js
    │   ├── globals.css
    │   ├── layout.js         # Layout global da aplicação
    │   └── page.js           # Página inicial
    ├── components/           # Componentes reutilizáveis
    │   ├── photo.jsx
    │   ├── card.jsx
    │   └── ... (outros componentes)
    └── lib/                  # Funções utilitárias
        └── utils.js
```

### 4.2. Fluxo de Dados e Rotas

O Next.js App Router gerencia as rotas da aplicação. Cada pasta dentro de `src/app` representa uma rota, e o arquivo `page.js` dentro de cada pasta é o componente principal dessa rota. O `layout.js` define o layout para as rotas aninhadas.

*   **`/`**: Página inicial (`src/app/page.js`)
*   **`/acervo`**: Seção do acervo (`src/app/acervo/page.js`)
*   **`/audiovisual`**: Seção audiovisual (`src/app/audiovisual/page.js`)
*   **`/mapa`**: Seção do mapa (`src/app/mapa/page.js`)
*   **`/revista`**: Seção da revista (`src/app/revista/page.js`)

O `layout.js` global em `src/app/layout.js` define a estrutura básica da página, incluindo o `HeaderApp` e `FooterApp`, e aplica estilos globais e fontes. A presença de `PageTransition.js` sugere transições suaves entre as páginas.

## 5. Servidor e Ambiente de Execução

O sistema será executado em um servidor com as seguintes especificações:

*   **Memória RAM**: 8GB
*   **Armazenamento**: 1TB HD

Considerando que a aplicação é um frontend Next.js, o servidor atuará principalmente como um ambiente de hospedagem para os arquivos estáticos gerados pelo processo de `build` do Next.js. Para aplicações Next.js que utilizam Server-Side Rendering (SSR) ou API Routes, o servidor também executará o ambiente Node.js para processar as requisições.

## 6. Funcionalidades Desenvolvidas

As funcionalidades desenvolvidas incluem:

*   **Interface do Usuário**: Páginas para Acervo, Audiovisual, Mapa e Revista, com um layout consistente e componentes reutilizáveis.
*   **Navegação**: Sistema de rotas para navegação entre as diferentes seções da plataforma.
*   **Design System**: Aplicação de um sistema de design, utilizando Tailwind CSS e os componentes Radix UI, para garantir consistência visual.
*   **Gerenciamento de Estados**: Implementação de um sistema para gerenciar o estado da aplicação.
*   **Mapa Base**: Implementação de um mapa interativo.





