import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import NotFound from '@/app/[locale]/not-found'
import { DictionaryProvider } from '@/app/providers/dictionary-provider'
import { getDictionary } from '@/helpers/internationalization/get-dictionary'

describe('NotFound', () => {
  it('shows the APOD not-found message in the current locale', async () => {
    const pt = await getDictionary('pt-BR')
    const en = await getDictionary('en-US')

    const ptHtml = renderToStaticMarkup(
      <DictionaryProvider value={pt}>
        <NotFound />
      </DictionaryProvider>,
    )
    const enHtml = renderToStaticMarkup(
      <DictionaryProvider value={en}>
        <NotFound />
      </DictionaryProvider>,
    )

    expect(ptHtml).toContain(pt.apod.not_found)
    expect(enHtml).toContain(en.apod.not_found)
  })
})
