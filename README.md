# APOD

Este repositório é um projeto demonstrativo (showcase) das minhas habilidades como desenvolvedor full‑stack. A aplicação consome a API APOD (Astronomy Picture of the Day) da NASA para exibir imagens e informações diárias, e serve como exemplo de arquitetura limpa, testes automatizados e um front-end moderno com Tailwind CSS.

**Objetivos**
- Mostrar competências em front-end e back-end.
- Aplicar Clean Architecture e separação de responsabilidades.
- Cobertura de testes (unitários e helpers) com Vitest.
- Interface simples e moderna usando Tailwind CSS.

**Tecnologias**
- Next.js
- TypeScript
- Tailwind CSS
- Vitest (testes)
- Vite (ferramentas de desenvolvimento)

**Variáveis de ambiente**
Defina as variáveis necessárias para a API da NASA antes de rodar a aplicação:

- `APOD_BASE_URL` — URL base usada no front para imagens/recursos públicos.
- `APOD_API_BASE_URL` — endpoint da API (ex.: `https://api.nasa.gov/planetary/apod`).
- `NASA_API_KEY` — chave de API da NASA.

Exemplo (bash):

Ver arquivo .env.example
```bash
export APOD_BASE_URL="https://apod.example.com"
export APOD_API_BASE_URL="https://api.nasa.gov/planetary/apod"
export NASA_API_KEY="SUA_CHAVE_AQUI"
```

**Como rodar**

Instale dependências:

```bash
npm install
```

Rodar em modo de desenvolvimento:

```bash
npm run dev
```

Executar testes:

```bash
npx vitest
```

**Estrutura principal até o momento**
- `app/` — rotas e componentes de página (Next.js).
- `domain/` — modelos de domínio e contratos (DTOs, repositórios).
- `helpers/` — helpers e utilitários compartilhados.
- `repositories/` — implementações de repositórios (inMemory, integração com NASA API).
- `usecase/` — casos de uso / lógica de aplicação.
- `utils/` — utilitários pequenos (ex.: `get-video-type`).
- `test/` — testes e utilitários de teste.