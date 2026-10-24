import Link from "next/link"
import type { ApodDto } from "@/domain/Apod/Dto/ApodDto"
import type { Dictionary } from "@/helpers/internationalization/get-dictionary"

interface ApodActionsProps {
  apod: ApodDto
  dictionary: Dictionary
}

export function ApodActions({ apod, dictionary }: ApodActionsProps) {
  const downloadUrl = apod.media_type === "image" ? apod.media_url : null

  return (
    <div className="mx-auto flex w-full flex-wrap lg:justify-end lg:gap-x-2">
      <Link
        href={apod.permalink}
        target="_blank"
        rel="noreferrer"
        className="btn-base mb-4 w-full border-nasa-blue text-center text-nasa-blue lg:mb-0 lg:w-auto"
      >
        {dictionary.button.go_to_apod}
      </Link>
      {downloadUrl && (
        <Link
          href={downloadUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-base mb-4 w-full border-transparent bg-nasa-blue text-center text-white lg:mb-0 lg:w-auto"
        >
          {dictionary.button.download}
        </Link>
      )}
    </div>
  )
}
