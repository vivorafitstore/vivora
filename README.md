# Vivora — Loja pública (Fundação)

E-commerce para mulheres que treinam em casa. Esta entrega é a **primeira camada**
do projeto: a loja pública, totalmente funcional sobre dados mockados e já
estruturada para a próxima camada (autenticação Firebase, dashboard
administrativo, pedidos e financeiro).

## O que já está pronto

- **Home** (`/`) — hero, benefícios, produtos em destaque, prova social, FAQ.
- **Catálogo** (`/loja`) — filtro por categoria, busca e ordenação.
- **Página de produto** (`/produto/[slug]`) — galeria, variações de cor/tamanho,
  avaliações, produtos relacionados.
- **Carrinho** (`/carrinho`) — adicionar, atualizar quantidade, remover,
  persistido no navegador. O botão "Finalizar compra" está desabilitado de
  propósito: o checkout real depende da integração de pagamento, que faz
  parte de uma próxima etapa.
- **Firebase já configurado** em `src/lib/firebase.ts` (Auth, Firestore,
  Storage) — falta só preencher as credenciais.
- Identidade visual própria (paleta, tipografia, elemento de assinatura "Pulse")
  documentada em `src/app/globals.css`.

## Como rodar localmente

```bash
npm install
cp .env.local.example .env.local   # preencha com as credenciais do seu projeto Firebase
npm run dev
```

Abra http://localhost:3000.

As credenciais do Firebase ficam em **Firebase Console → Configurações do
projeto → Geral → Seus apps → SDK setup and configuration**. Sem elas, o app
roda normalmente (a loja pública não depende de autenticação ainda), mas
qualquer chamada futura ao Auth/Firestore vai falhar até você preenchê-las.

> Nota: as fontes (Unbounded, Inter, Space Mono) são carregadas via
> `next/font/google` no build. Isso exige acesso à internet durante o build —
> funciona normalmente em `npm run dev`/`npm run build` local, Vercel, Netlify
> etc. Se você buildar em um ambiente sem acesso a `fonts.googleapis.com`, o
> build vai falhar nesse passo especificamente.

## Estrutura

```
src/
  app/
    page.tsx              → Home
    loja/                 → Catálogo (filtros/busca/ordenação)
    produto/[slug]/        → Página de produto
    carrinho/              → Carrinho
  components/             → Header, Footer, ProductCard, AddToCartButton, ProductVisual
  context/CartContext.tsx → Estado global do carrinho (localStorage)
  lib/
    types.ts              → Tipos de domínio (Product, CartItem, Review...)
    products.ts           → Catálogo mockado — mesmo formato da futura coleção Firestore "produtos"
    firebase.ts            → Inicialização do Firebase (Auth, Firestore, Storage)
    format.ts              → Formatação de moeda (BRL)
```

## Sobre as imagens de produto

Ainda não há fotos reais. Cada produto tem uma `paletaVisual` (par de cores) e
é renderizado como um cartão de gradiente com a marca Vivora — isso evita usar
fotos de banco de imagens sem licença adequada e mantém a "vitrine" coerente
enquanto não há fotografia própria. Trocar por fotos reais é uma mudança local
em `src/components/ProductVisual.tsx` (ou substituir seu uso por `<Image
src={produto.imagemUrl} />` assim que as URLs do Firebase Storage existirem).

## Migrando de dados mockados para Firestore

`src/lib/products.ts` foi desenhado para que a migração seja direta: a coleção
`produtos` no Firestore deve seguir exatamente os campos de `Product` em
`src/lib/types.ts`. Quando o backend estiver pronto, as funções
`getProductBySlug`, `getRelatedProducts` etc. passam a fazer `getDocs`/`query`
no Firestore em vez de filtrar o array em memória — as páginas que as
consomem não precisam mudar.

## Próximas camadas (fora do escopo desta entrega)

1. Autenticação Firebase (login Google, e-mail/senha, cadastro, recuperação de senha)
2. Cargos e permissões (Gerente, Funcionário, Cliente)
3. Dashboard administrativo (métricas, financeiro, pedidos, produtos, cupons)
4. Checkout real + integração de pagamento (Stripe/Mercado Pago/PagSeguro/Pagar.me)
5. Área do cliente (pedidos, rastreamento, perfil, endereços)
