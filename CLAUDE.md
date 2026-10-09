# Expedição Incas & Uyuni 2026 — contexto para o Claude

App web (PWA) para 4 amigos numa viagem de moto (3× BMW R 1250 GS + 1× R 1300 GS):
Governador Valadares → Peru → Bolívia → Governador Valadares, de 15/10 a 08/11/2026.
Cliente: Valério (piloto-cliente da Node Data). Responsável Node Data: Eduardo (comercial, não técnico — explicar passo a passo).

## Publicação
- GitHub `lorenaventuraf/incas-uyuni-2026` → Netlify (deploy automático da branch `main`, sem build, raiz = publish dir).
- URL: https://incas-uyuni-2026-gs.netlify.app
- Link de piloto: `https://incas-uyuni-2026-gs.netlify.app/?piloto=<CÓDIGO>` (o código NÃO fica no repositório; está na função `public.is_pilot()` no Supabase).

## Arquivos
- `data.js` — TODO o roteiro (dias, paradas, km, avisos). Mudança de rota = editar aqui.
  Paradas: `t` = start | fuel | border | stop | end; `c` = confiança C/P/S; `cc` = BR/PE/BO.
- `app.js` — interface (mapa SVG, dias, paradas, check-in, mídia, diário, modo piloto).
- `sync.js` — fila offline em IndexedDB + REST do Supabase (fetch direto, sem supabase-js).
- `media.js` — compressão de fotos no celular (2048 px / miniatura 480 px) e moldura da expedição (canvas).
- `sw.js` — service worker (app abre offline). **Ao mudar arquivos do app, suba a constante `V` (iu26-vN).**
- `imprimir.html` — versão para impressão (o organizador da rota imprime tudo).
- `gerar-rotas.html` — gera `routes.js` com o traçado real via OSRM (rodar no navegador do usuário).
- `samap.js` — contornos dos países (gerado), `vendor/` — Leaflet 1.9.4.
- `img/nodedata-logo.png` (logo na moldura), `img/selo.png` (selo da expedição — opcional, entra sozinho se existir).

## Supabase (projeto `doqtppldrwyowzifmrqt`, sa-east-1, plano grátis)
- Tabelas `checkins` e `media` (leitura pública; insert/delete só com header `x-trip-key` válido → `public.is_pilot()`).
- Bucket público `media`, pasta `trip2026/dia-XX/`, limite 50 MB, só imagem/vídeo.
- Vídeos: o app aceita até 45 MB e só envia quando o piloto toca "Enviar vídeos (use Wi-Fi)".
- Plano grátis: ~1 GB de storage no total. Acompanhar uso durante a viagem.
- Tabela `messages` (mural): qualquer um envia (nome + até 280 caracteres, limite de frequência por trigger); só piloto apaga.
- Tabela `reactions` (❤️ 👏 🏍 por foto, uma por aparelho).
- `CFG.since` em `config.js`: o app só mostra registros a partir dessa data. Usado para "zerar" testes sem apagar nada.
  **Na véspera da saída (14/10 à noite), atualizar para a hora atual.**

## Modos da página
- Sem código de piloto → `body.family`: versão resumida (onde estão, mapa com progresso, diário, mural, roteiro resumido).
  Elementos só de piloto têm a classe `pilot-only`; só da família, `family-only`.
- Com código + nome → versão completa, com aviso de recados novos.

## Decisões já tomadas (não reabrir sem motivo)
- Sem login: código de piloto + nome. Família só abre o link (somente leitura).
- Moldura desenhada em código (faixa fina na base), não imagem de IA. Original fica na galeria do celular.
- Público principal no celular: iPhone (Safari). No iPhone a fila só sobe com o app aberto e com sinal.
- Usuário quer explicações simples, em português, com nível de confiança [Certo]/[Provável]/[Suposição].
