# Configuração da integração de pagamento (Mercado Pago)

Este documento existe para você não perder o fio da meada de como configurar
o pagamento real (Pix + Cartão) em produção. Nada disso fica no código —
são variáveis de ambiente configuradas no painel do Cloudflare Pages.

## Como funciona

- `/functions/api/pagamento/*` são Cloudflare Pages Functions (servidor,
  fora do navegador). É onde o Access Token secreto do Mercado Pago vive.
- O site (`output: export`) continua 100% estático — as Functions são uma
  camada adicional que o Cloudflare já roda junto, de graça, sem precisar
  do plano pago do Firebase (Blaze) nem de Cloud Functions.
- As Functions escrevem no Firestore via REST API, autenticando como uma
  Service Account (Admin) — isso **ignora completamente as firestore.rules**
  (é o comportamento padrão e documentado do Google para credenciais de
  service account, que agem como a própria aplicação, não como um usuário).
  Por isso a Service Account Key é tão sensível: trate-a como uma senha
  mestra do projeto e nunca a exponha fora do painel de secrets do Cloudflare.

## Variáveis a configurar no Cloudflare Pages

Painel do Cloudflare → seu projeto (vivora-bnh) → **Settings → Environment
variables**. Adicione tanto em "Production" quanto em "Preview" se você usa
preview deployments.

| Nome | Tipo | Valor |
|---|---|---|
| `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` | Variável normal | Public Key do Mercado Pago (teste ou produção) |
| `MERCADOPAGO_ACCESS_TOKEN` | **Secret** | Access Token do Mercado Pago (teste ou produção) |
| `MERCADOPAGO_WEBHOOK_SECRET` | **Secret** | Chave secreta gerada ao configurar o webhook (veja abaixo) |
| `FIREBASE_PROJECT_ID` | Variável normal | `vivora-7ac32` |
| `FIREBASE_SERVICE_ACCOUNT` | **Secret** | Conteúdo completo do JSON da Service Account, em uma linha só |

No Cloudflare, marque como **Secret** (não "Plaintext") qualquer valor que
não deveria aparecer em logs ou ser lido depois — Access Token, Webhook
Secret, e a Service Account inteira.

### Sobre `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`

Como o site é `output: export`, essa variável é embutida no JS **no
momento do build**, não lida em runtime. Ou seja: ela precisa estar
configurada no Cloudflare *antes* do deploy que você quer que já tenha
pagamento funcionando — não basta configurar depois e esperar o site
atual atualizar sozinho, é preciso um novo build.

### Sobre `FIREBASE_SERVICE_ACCOUNT`

Pegue o JSON gerado em Firebase Console → Project Settings → Service
accounts → Generate new private key, e cole o conteúdo inteiro (incluindo
as chaves `{ }`) como uma única linha no valor da variável no Cloudflare.

Depois de configurar isso no Cloudflare, **revogue essa key no Firebase
Console** se ela passou por qualquer outro lugar (chat, arquivo local,
etc.) antes de chegar lá — gere uma nova se precisar usá-la de novo.

## Configurando o Webhook no Mercado Pago

1. No [painel de desenvolvedores do Mercado Pago](https://www.mercadopago.com.br/developers/panel),
   abra sua aplicação → **Webhooks** (ou "Notificações")
2. URL do webhook: `https://vivora-bnh.pages.dev/api/pagamento/webhook`
3. Evento: `order` (ou "Orders", dependendo de como aparece na tela)
4. Ao salvar, o Mercado Pago mostra uma **chave secreta** — essa é a
   `MERCADOPAGO_WEBHOOK_SECRET` que vai no Cloudflare.

## Testando

Com credenciais de **teste**, use os
[cartões de teste do Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs/checkout-api-orders/testing)
para simular aprovação/recusa, e o Pix de teste é confirmado automaticamente
em alguns segundos pelo simulador deles (não precisa de app de banco real).

## Indo para produção

Quando estiver tudo validado:
1. Gere credenciais de **produção** no painel do Mercado Pago (Public Key
   e Access Token vão mudar de prefixo/valor)
2. Atualize `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` e `MERCADOPAGO_ACCESS_TOKEN`
   no Cloudflare com os valores de produção
3. Reconfigure o webhook apontando para as credenciais de produção (gera
   um `MERCADOPAGO_WEBHOOK_SECRET` novo)
4. Force um novo deploy (qualquer commit, ou "Retry deployment" no Cloudflare)
