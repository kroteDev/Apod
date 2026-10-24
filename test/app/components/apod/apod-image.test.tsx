// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { ApodImage } from '@/app/components/apod/apod-image'

const SRC = 'https://assets.science.nasa.gov/a.jpg'
const OTHER_SRC = 'https://assets.science.nasa.gov/b.jpg'

function renderImage(src = SRC) {
  return render(
    <ApodImage
      src={src}
      alt="A galaxy"
      className="img-class"
      frameClassName="frame-class"
      loadingClassName="loading-class"
      fallback={<p>Media unavailable</p>}
    />,
  )
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('ApodImage', () => {
  it('shows a skeleton and a hidden image while loading', () => {
    const { container } = renderImage()
    const image = screen.getByRole('img', { hidden: true })

    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull()
    expect(image.className).toContain('opacity-0')
    expect(container.firstElementChild?.className).toContain('loading-class')
  })

  it('reveals the image and removes the skeleton once it loads', () => {
    const { container } = renderImage()

    fireEvent.load(screen.getByRole('img', { hidden: true }))

    expect(screen.getByRole('img').getAttribute('src')).toBe(SRC)
    expect(screen.getByRole('img').className).toContain('opacity-100')
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull()
    expect(container.firstElementChild?.className).not.toContain('loading-class')
  })

  it('shows the fallback when the image fails', () => {
    renderImage()

    fireEvent.error(screen.getByRole('img', { hidden: true }))

    expect(screen.getByText('Media unavailable')).not.toBeNull()
    expect(screen.queryByRole('img', { hidden: true })).toBeNull()
  })

  it('goes back to loading when the source changes', () => {
    const { rerender } = renderImage()
    fireEvent.load(screen.getByRole('img', { hidden: true }))
    expect(screen.getByRole('img').className).toContain('opacity-100')

    rerender(
      <ApodImage src={OTHER_SRC} alt="A galaxy" fallback={<p>Media unavailable</p>} />,
    )

    expect(screen.getByRole('img', { hidden: true }).className).toContain('opacity-0')
  })

  it('treats an image already in the cache as loaded', () => {
    vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(true)
    vi.spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get').mockReturnValue(800)

    renderImage()

    expect(screen.getByRole('img').className).toContain('opacity-100')
  })

  it('shows the fallback for an image that already failed before the page was hydrated', () => {
    vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(true)
    vi.spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get').mockReturnValue(0)

    renderImage()

    expect(screen.getByText('Media unavailable')).not.toBeNull()
    expect(screen.queryByRole('img', { hidden: true })).toBeNull()
  })
})
