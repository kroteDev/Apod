# AGENTS.md

Context for AI agents and new contributors working on this repository. Read this before changing code.

## What this project is

APOD (Astronomy Picture of the Day) showcase built with Next.js. It shows NASA's daily picture with its explanation, and it is also a portfolio piece for Clean Architecture, testing, and a Tailwind front end. The README is in Portuguese; code identifiers are mostly English, and comments and commit descriptions are mostly Portuguese.

Current state:
- Data layer (API client, mapper, repositories, helpers) is implemented and tested.
- Locale support is in place: `pt-BR` (default) and `en-US`. Every URL is prefixed with the locale (`/pt-BR`, `/en-US`). `proxy.ts` redirects unprefixed or short paths (`/`, `/pt`, `/about`) to the full locale, and `app/[locale]/layout.tsx` returns 404 for anything else.
- `app/[locale]/page.tsx` is a placeholder used to test locales. The real home, `/apod/[id]`, and `/about` pages are still to be built.
- The colors, the lib layer that pages will use, and the UI itself are still to be migrated from `.references/Apod-nextjs`.

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies (Node 22, see `.nvmrc`) |
| `npm run dev` | Next.js dev server on port 3000 |
| `npm run build` | Production build (also runs the TypeScript check) |
| `npm run test` | Vitest, single run. This is the CI command. |
| `npm run test:watch` | Vitest in watch mode |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (ignores `.references/`) |
| `npm run ci` | lint + typecheck + test. Run this before committing. |

Tests never call the network. They use `vi.stubGlobal('fetch', ...)` or fake repositories and fixtures in `test/fixtures/apod-raw.ts`.

## Architecture

Clean Architecture with a strict direction of dependencies: `app/` and `repositories/` depend on `domain/`; `infrastructure/` implements the client contract from `domain/`.

```
domain/                       Pure contracts and models. No framework code.
  Apod/Dto/ApodDto.ts           Domain DTO and ApodPage (paged result)
  Apod/Dto/IApodRepository.ts   findMany(start, end, page, per_page), findByDate(date)
  Apod/RawResponse/...          Raw payload shape of the NASA endpoint
  shared/IApodApiClient.ts      Client contract: getByDate(date), getList(start, end, page, per_page)
  shared/result.ts              Result<Error, Value> (success / error helpers)
  shared/errors.ts              NotFound, InvalidData, InternalServer, UnauthorizedServer

infrastructure/http/ApodApiClient.ts  fetch-based client for the NASA endpoint
repositories/
  NasaApi/NasaApiRepository.ts        Real repository (client + mapper)
  inMemory/ApodInMemoryRepository.ts  Fake data with paging, used under NODE_ENV=test
  helpers/mapper.ts                   Raw payload -> ApodDto
  ApodRepository.ts                   Factory: test -> in-memory, otherwise NASA API
utils/
  legacy-date.ts        ISO date <-> legacy YYMMDD code
  html-to-text.ts       Strips HTML and decodes entities
  extract-media.ts      Finds the playable media in basic_html, with host allowlist
  get-video-type.ts     URL -> youtube | vimeo | video | null (used by extract-media)
helpers/get-site-config.ts   Reads APOD_BASE_URL, APOD_API_BASE_URL, NASA_API_KEY
helpers/internationalization/
  index.ts              supportedLocales, defaultLocale, Locale, isSupportedLocale
  get-dictionary.ts     Loads resources/dictionaries/{pt_BR,en_US}.json
resources/dictionaries/      UI copy per locale (keep both files with the same keys)
proxy.ts                     Locale redirect (Next 16 name; middleware.ts is deprecated)
app/[locale]/                Locale-prefixed routes; layout sets <html lang> and the dictionary
app/providers/dictionary-provider.tsx  Client context with useDictionary()
test/                        Vitest suites, mirroring the source folders
```

Result pattern: methods return `Result<E, S>` and do not throw for expected failures. Check with `isSuccess()` / `isError()` and read `.value`.

## The data source (important)

The app uses the WordPress REST route of the public NASA Science site, not the old `api.nasa.gov/planetary/apod` endpoint, which is being disabled.

- Base URL: `https://science.nasa.gov/wp-json/wp/v2/apod-basic` (set in `APOD_API_BASE_URL`).
- No API key is needed. `NASA_API_KEY` is still read by `getSiteConfig` but the client does not use it. It stays until the old API is gone (decision 5).
- Single entry: `GET /apod-basic/{YYMMDD}` returns one object. A missing date returns 404 with `code: "apod_basic_not_found"`.
- List: `GET /apod-basic/?page=&per_page=&date_from=&date_to=` returns an array. `per_page` is capped at 25. Totals come back in `X-WP-Total` and `X-WP-TotalPages`. Results are newest first. The date range is inclusive. A reversed range returns `[]`, but the client rejects it first.
- Dates in the URL must be `YYMMDD`. `2026-01-01` gives 400 `rest_invalid_param`. The domain always uses ISO `YYYY-MM-DD`, and only `utils/legacy-date.ts` converts.
- Earliest data: 1995-06-16.
- Fields used: `post_id`, `date`, `title`, `permalink`, `media_type`, `explanation` (HTML), `credit`, `copyright` (HTML), `alt`, `hdurl`, `basic_html`.
- `url` is the article page now, not the media file. Do not read media from `url`.
- Images: `hdurl`. Videos: the playable source is only in `basic_html`. YouTube is an `<iframe>` with a protocol-relative src, and some videos are `<video><source src="...mp4">`. For videos, `hdurl` is a poster or a generic placeholder.
- Official `apod-api` (in `.references/apod-api`, which is gitignored) already uses this endpoint. Its README still documents the old API.

The live endpoint has no documented rate limit, SLA, or stability guarantee. Treat its shape as something that can change.

## Decisions log

These were made deliberately. Do not reverse them without asking the owner.

1. **Single API only.** The old `api.nasa.gov` endpoint is removed from code. Mixing both was rejected because the payloads have different meanings (`url`, `concepts`, `thumbnail_url`).
2. **No random.** `findRandom` and `getRandom` were removed. The new API has no random endpoint.
3. **Paging is exposed.** `findMany(start, end, page, per_page)` returns `ApodPage` with `items`, `page`, `per_page`, `total`, `total_pages`. The default is page 1 with 25 items. `per_page` is capped at 25 and ranges longer than 25 days need paging.
4. **Plain text only.** `explanation`, `copyright`, and `alt` are stripped of HTML server-side. Anchor URLs never reach the UI, because the UI sends users to the official `permalink`.
5. **API key kept for now.** `NASA_API_KEY` stays in config as unused. Remove it when the old API is gone.
6. **Media allowlist.** Media URLs are only accepted from `assets.science.nasa.gov` (files and images) and from YouTube or Vimeo iframes. Anything else becomes `null`. An unplayable video has `media_url = null` and the UI should link to `permalink`.
7. **Factory fixed.** `ApodRepository.getInstance()` uses the in-memory repository only when `NODE_ENV === 'test'`. Previously it was inverted.
8. **Retries.** Up to 3 attempts for 5xx, 429, and network errors, with linear backoff. No retry for 4xx.
9. **Caching.** The client sets `next: { revalidate }`. Dates in the last 2 days and all lists use 1 hour. Older dates use 7 days.
10. **No `'use server'`.** The client is server-only code used by repositories, not a Server Action. Next.js only allows async function exports in `'use server'` files, and the client exports a class.
11. **Typo fixed.** `RawReponse` is now `RawResponse`.
12. **Video credit label.** Labels such as "Image Credit:" and "Video Credit:" are stripped from `copyright`.
13. **Locales in the URL.** Supported: `pt-BR` (default) and `en-US`. Every page lives under `app/[locale]/`. Short prefixes (`/pt`, `/en`) redirect to the full locale. Unknown locales return 404. Dictionary keys are shared between the two JSON files, and `en_US.json` must have the same keys as `pt_BR.json`.
14. **Proxy, not middleware.** The request interceptor is `proxy.ts` with `export function proxy`. Next 16.2 warns that `middleware.ts` is deprecated.

## Adding a locale

1. Add the code to `supportedLocales` in `helpers/internationalization/index.ts`. Keep `defaultLocale` valid.
2. Create `resources/dictionaries/<xx_YY>.json` with the same keys as `pt_BR.json`. The file name is the locale with `-` replaced by `_`.
3. Add the loader to `dictionaries` in `helpers/internationalization/get-dictionary.ts`. TypeScript fails without it.
4. Run `npm run test`. `test/internationalization/` loops over `supportedLocales` and checks that the file exists, the keys match the default locale, and no text is empty. It also checks that `/<lang>` redirects to the full locale.
5. Run `npm run build` to confirm `generateStaticParams` prerenders the new routes.

Short prefixes (`/es`) redirect to the first supported locale with that language.

## Conventions

- **Commits:** Conventional Commits, `type: description`. Descriptions are in Portuguese to match the existing history (e.g. `feat(apod): migra para a API apod-basic do science.nasa.gov`). Keep commits small and each one green (`npm run ci`).
- **Tests:** live in `test/`, mirroring the source folders. Use fixtures from `test/fixtures/apod-raw.ts`. Inject fake clients into `NasaApiRepository` rather than mocking modules. Vitest only runs `test/**` because dot-folders such as `.references/` are skipped by default.
- **Imports:** `@/` maps to the project root (see `tsconfig.json`).
- **Result errors:** use the error classes in `domain/shared/errors.ts`. Do not throw for expected failures.
- **Security:** never render HTML from the API. Validate hosts before using any media URL.
- **Do not edit** `.references/` (reference copies, gitignored) or `.env` (local secrets, gitignored).

## Gotchas

- Your local `.env` must have `APOD_API_BASE_URL=https://science.nasa.gov/wp-json/wp/v2/apod-basic`. A stale value (such as the old `api.nasa.gov`) makes any real call fail. Tests use fixtures and are not affected.
- `Dockerfile` runs `npm run dev`, not a production build. It is not production-ready yet.
- `playwright.config.js` points to `tests/e2e`, which does not exist. There are no e2e tests yet.
- `next.config.ts` still has `localhost` and `127.0.0.1` in `remotePatterns`, kept from the starting template.
- After deleting or moving files under `app/`, run `rm -rf .next` before `npx tsc --noEmit`. Stale generated types in `.next/` otherwise reference the deleted files.
- The sample fixtures reflect July–October 2026 data. They are fake data, so they can be older than live data without any test failing.

## CI/CD plan (status)

Done:
- `npm run ci` is the single gate: lint, typecheck, tests. It passes locally.
- Tests are deterministic and offline, so they are safe to run in any runner.
- `npm run build` has been verified locally.

Planned, not yet created:
1. A GitHub Actions workflow on `pull_request` and on push to `main` that runs `npm ci` and `npm run ci` on Node 22 (read from `.nvmrc`).
2. A build job after CI: `npm run build`.
3. A deploy step. The old project deployed by SSH to a droplet (see `.references/Apod-nextjs/.github/workflows/deploy.yml`). This repo has no deploy workflow yet, and the Dockerfile needs a production stage first.
4. Optional: a scheduled live smoke check (not in the default gate, because it depends on the network and on an external API) that calls `findByDate` for one known date and fails if the shape changes.

Ask the owner before adding a workflow or deploy secrets.

## Known gaps and next steps

- The UI does not use the repository yet. Wiring pages (home, `/apod/[date]`, list) is the next product step.
- `Dockerfile` needs a multi-stage production build (`npm run build` then `npm start` or standalone output).
- Add runtime validation of the NASA payload if the endpoint changes often (currently a shallow type check in `parseRawApod`).
- Playwright e2e setup is unused.
