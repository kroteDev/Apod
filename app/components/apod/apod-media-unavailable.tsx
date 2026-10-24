import type { Dictionary } from "@/helpers/internationalization/get-dictionary"

interface ApodMediaUnavailableProps {
  dictionary: Dictionary
}

export function ApodMediaUnavailable({ dictionary }: ApodMediaUnavailableProps) {
  return (
    <p className="mx-auto mb-14 w-full max-w-3xl border-l-4 border-nasa-red bg-site-background px-4 py-3 text-grey-dark">
      {dictionary.apod.media_unavailable}
    </p>
  )
}
