# APOD

Este repositório é um projeto demonstrativo (showcase) das minhas habilidades como desenvolvedor full‑stack. A aplicação consome a API APOD (Astronomy Picture of the Day) da NASA para exibir a imagem ou vídeo do dia, com a explicação, e serve como exemplo de arquitetura limpa, testes automatizados e um front-end moderno com Tailwind CSS.

**Objetivos**
- Mostrar competências em front-end e back-end.
- Aplicar Clean Architecture e separação de responsabilidades.
- Cobertura de testes (unitários e helpers) com Vitest.
- Interface simples e moderna usando Tailwind CSS.

**Tecnologias**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Vitest (testes)
- ESLint (lint)
- Playwright (configurado, ainda sem testes e2e)

**Fonte dos dados**

A aplicação usa o endpoint oficial do site de ciência da NASA (`science.nasa.gov/wp-json/wp/v2/apod-basic`). O endpoint antigo (`api.nasa.gov/planetary/apod`) foi desativado e não é mais usado.

- Consulta por data: `/apod-basic/{YYMMDD}`.
- Lista e intervalos: paginação com `page` e `per_page` (máximo 25), filtros `date_from` e `date_to` no formato `YYMMDD`.
- Não é necessária chave de API.

## Variáveis de ambiente

Crie um arquivo `.env` na raiz (use `.env.example` como base):

| Variável | Descrição |
|---|---|
| `APOD_BASE_URL` | URL pública do site APOD (ex.: `https://apod.nasa.gov`). |
| `APOD_API_BASE_URL` | Endpoint da API: `https://science.nasa.gov/wp-json/wp/v2/apod-basic`. |
| `NASA_API_KEY` | Opcional. Lida pela configuração, mas ainda não usada pelo cliente. Será removida quando o endpoint antigo sair de vez. |

## Como rodar

Instale as dependências (Node 22, conforme `.nvmrc`):

```bash
npm install
```

Rode em modo de desenvolvimento:

```bash
npm run dev
```

Gere o build de produção:

```bash
npm run build
```

## Testes e qualidade

| Comando | O que faz |
|---|---|
| `npm run test` | Roda todos os testes uma vez (Vitest). |
| `npm run test:watch` | Roda os testes em modo watch durante o desenvolvimento. |
| `npm run typecheck` | Verifica os tipos com TypeScript (`tsc --noEmit`). |
| `npm run lint` | Roda o ESLint. |
| `npm run ci` | Executa lint, typecheck e testes, na mesma ordem usada pelo pipeline. |

Os testes não acessam a rede: usam fixtures com payloads reais e repositórios falsos. Por isso são determinísticos e podem rodar em qualquer ambiente de CI.

### CI/CD e deploy

O workflow `.github/workflows/ci-cd.yml` roda em todo pull request e em todo push para `main`:

| Job | Quando roda | O que faz |
|---|---|---|
| `ci` | PR e `main` | `npm ci` e `npm run ci` (lint, tipos e testes), no Node de `.nvmrc`. |
| `build` | depois de `ci` | `npm run build`. |
| `deploy` | só em push para `main`, depois de `ci` e `build` | Conecta por SSH no droplet, roda `git reset --hard origin/main` e `docker compose up -d --build`, e faz um teste de fumaça em `https://apod.krotedev.com.br/api/health`. |

Se algum job falhar, o deploy não acontece.

Segredos do GitHub (Settings > Secrets and variables > Actions):
- `DROPLET_HOST`, `DROPLET_USER` e `DROPLET_SSH_KEY`.

Configuração do droplet (uma vez só):
1. Clone o repositório em `/var/www/projects/apod`.
2. Crie o `.env` na raiz do projeto, com as variáveis abaixo.
3. Configure o Nginx para `apod.krotedev.com.br` (exemplo abaixo) e emita o certificado com `sudo certbot --nginx -d apod.krotedev.com.br`.
4. Suba o container pela primeira vez: `docker compose up -d --build`.

Variáveis do `.env`. O `docker-compose.yml` não tem portas fixas: tudo vem daqui.

| Variável | Exemplo | Para que serve |
|---|---|---|
| `APOD_BASE_URL` | `https://apod.nasa.gov` | Link oficial da APOD. |
| `APOD_API_BASE_URL` | `https://science.nasa.gov/wp-json/wp/v2/apod-basic` | Endpoint da API. |
| `NASA_API_KEY` | `...` | Mantida na configuração, ainda não usada. |
| `APP_PORT` | `3001` | Porta publicada no host. O Nginx aponta para ela. |
| `APP_INTERNAL_PORT` | `3000` | Porta do Next.js dentro do container. |

Para testar o Docker localmente, defina `APP_PORT` e `APP_INTERNAL_PORT` no `.env` e rode `docker compose up --build`. Depois, `curl http://localhost:3001/api/health` deve responder `{"ok":true}`.

Exemplo de bloco do Nginx (o Certbot acrescenta o TLS):

```nginx
server {
    server_name apod.krotedev.com.br;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Estrutura

```
app/                      Rotas e páginas (Next.js). Sobre e a página de uma APOD (`/apod/[data]`) estão prontas; a home ainda é provisória.
domain/                   Contratos e modelos puros (DTOs, interfaces, Result, erros).
infrastructure/http/      Cliente HTTP da API da NASA (datas, paginação, retries, cache).
repositories/             Implementações: API da NASA, dados em memória e mapper.
utils/                    Helpers: data legada, formatação de data, HTML para texto, extração de mídia.
helpers/                  Leitura da configuração do ambiente.
test/                     Testes Vitest, espelhando a estrutura de pastas.
```

## Idiomas

O site suporta `pt-BR` (padrão) e `en-US`. Toda página fica sob o prefixo do idioma (`/pt-BR/...`, `/en-US/...`). Acessos sem prefixo são redirecionados pelo `proxy.ts`, e `/pt` ou `/en` vão para o idioma completo. Idiomas não suportados, como `/fr-FR/about`, caem no idioma padrão e mantêm o restante do caminho (`/pt-BR/about`), em vez de dar erro 404.

Para adicionar um novo idioma (ex.: `es-ES`):

1. Adicione o código em `supportedLocales`, em `helpers/internationalization/index.ts`.
2. Crie `resources/dictionaries/es_ES.json` com as mesmas chaves de `pt_BR.json`.
3. Adicione o carregamento no objeto `dictionaries`, em `helpers/internationalization/get-dictionary.ts`. Sem isso o TypeScript acusa erro.
4. Rode `npm run test`. Os testes verificam se o arquivo existe, se as chaves batem com o idioma padrão e se nenhum texto está vazio. Todos os idiomas são testados automaticamente.
5. Rode `npm run build`. As rotas do novo idioma são geradas por `generateStaticParams`.

## Decisões principais

- **Um único endpoint.** Só o endpoint `apod-basic` é usado.
- **Texto puro.** Explicação, créditos e textos alternativos chegam sem HTML. Links externos não chegam à interface; o usuário é direcionado à página oficial da APOD.
- **Mídia com lista de domínios permitidos.** Imagens vêm de `assets.science.nasa.gov`. Vídeos vêm de iframes do YouTube ou do Vimeo, ou de arquivos `.mp4` no mesmo domínio da NASA. Qualquer outra origem é descartada.
- **Paginação exposta.** `findMany` recebe `page` e `per_page` e devolve os totais, porque intervalos longos precisam de mais de uma página.
- **Sem sorteio aleatório.** O endpoint novo não oferece essa função.
- **Cache e retries.** Datas recentes são revalidadas a cada hora e datas antigas a cada 7 dias. Erros 5xx, 429 e de rede são repetidos até 3 vezes.

Os detalhes completos estão no arquivo `AGENTS.md`, que também serve de contexto para agentes de IA.

## Status

- Camada de dados (cliente, mapper, repositórios e helpers) implementada e testada.
- Interface ainda é a página padrão do Next.js: a próxima etapa é ligar as páginas ao repositório.
- `Dockerfile` de produção (multi-stage, Node 22, usuário não-root) e deploy automático pelo GitHub Actions. Veja a seção CI/CD.

## Autor

Bruno Oliveira (krotedev)
