import { describe, it, expect, afterEach, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import Home, { generateMetadata } from '@/app/[locale]/(home)/page'
import { getApodPage } from '@/app/lib/apod'
import { IApodRepository } from '@/domain/Apod/Dto/IApodRepository'
import { InternalServerError } from '@/domain/shared/errors'
import { error, success } from '@/domain/shared/result'
import { ApodRepository } from '@/repositories/ApodRepository'

async function render(locale = 'pt-BR'): Promise<string> {
  const element = await Home({ params: Promise.resolve({ locale }) })
  return renderToStaticMarkup(element)
}

function withRepository(repository: Partial<IApodRepository>) {
  vi.spyOn(ApodRepository, 'getInstance').mockReturnValue(repository as IApodRepository)
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('home page', () => {
  it('shows the latest APOD as the featured day, in full', async () => {
    const html = await render()

    expect(html).toContain('<h1 class="mb-6 text-4xl font-semibold text-black">Andromeda in Southern Spring</h1>')
    expect(html).toContain('<figure')
    expect(html).toContain('href="https://science.nasa.gov/image-article/apod-2026-october-23-andromeda-in-southern-spring/"')
  })

  it('lists the other days as cards, without repeating the featured one', async () => {
    const html = await render()

    expect(html.match(/<article class="apod-card/g)?.length).toBe(4)
    expect(html.match(/>Andromeda in Southern Spring</g)?.length).toBe(1)
    expect(html).toContain('<h2 class="mb-6 text-3xl font-semibold">')
  })

  it('links every card to its internal detail page', async () => {
    const html = await render()

    expect(html).toContain('href="/pt-BR/apod/2026-10-22"')
    expect(html).toContain('href="/pt-BR/apod/2026-10-16"')
    expect(html).toContain('href="/pt-BR/apod/2026-07-03"')
    expect(html).toContain('href="/pt-BR/apod/2025-12-08"')
  })

  it('titles the list with the page title in the locale', async () => {
    expect(await render()).toContain('Um dia desses')
    expect(await render('en-US')).toContain('One of these days')
  })

  it('uses the read-more action on cards and the official link on the featured day', async () => {
    const html = await render()

    expect(html).toContain('Ler mais')
    expect(html).toContain('Ir para o Apod')
  })

  it('shows only the featured day when there is just one APOD', async () => {
    const all = await getApodPage({ per_page: 25 })
    if (!all.isSuccess()) throw new Error('fixture missing')
    const [only] = all.value.items

    withRepository({
      findMany: async () => success({ items: [only], page: 1, per_page: 25, total: 1, total_pages: 1 }),
    })

    const html = await render()

    expect(html).toContain(only.title)
    expect(html).not.toContain('Um dia desses')
    expect(html).not.toContain('apod-card')
  })

  it('shows the empty message when there is no APOD at all', async () => {
    withRepository({
      findMany: async () => success({ items: [], page: 1, per_page: 25, total: 0, total_pages: 0 }),
    })

    const html = await render()

    expect(html).toContain('Nenhuma APOD disponível no momento.')
    expect(html).not.toContain('<article')
  })

  it('rethrows server errors so the error boundary handles them', async () => {
    withRepository({
      findMany: async () => error(new InternalServerError('offline')),
    })

    await expect(render()).rejects.toBeInstanceOf(InternalServerError)
  })
})

describe('home page metadata', () => {
  it('mixes the site name with the featured APOD title', async () => {
    const metadata = await generateMetadata()

    expect(metadata.title).toBe('KröteDev APOD - Andromeda in Southern Spring')
    expect(metadata.openGraph?.images).toContain('assets.science.nasa.gov')
  })

  it('falls back to the site title when there is no APOD', async () => {
    withRepository({
      findMany: async () => success({ items: [], page: 1, per_page: 25, total: 0, total_pages: 0 }),
    })

    expect(await generateMetadata()).toEqual({ title: 'KröteDev APOD' })
  })
})
