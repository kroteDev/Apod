import Link from "next/link"
import type { ApodDto } from "@/domain/Apod/Dto/ApodDto"
import type { Dictionary } from "@/helpers/internationalization/get-dictionary"

interface ApodActionsProps {
  apod: ApodDto
  dictionary: Dictionary
  detailHref?: string
  className?: string
}

export function ApodActions({ apod, dictionary, detailHref, className = "" }: ApodActionsProps) {
  const downloadUrl = apod.media_type === "image" ? apod.media_url : null

  return (
    <div className={`flex w-full flex-wrap lg:w-auto lg:gap-x-2 ${className}`}>
      {detailHref ? (
        <Link
          href={detailHref}
          className="btn-base mb-4 w-full border-nasa-blue text-center text-nasa-blue lg:mb-0 lg:w-auto"
        >
          {dictionary.button.read_more}
        </Link>
      ) : (
        <Link
          href={apod.permalink}
          target="_blank"
          rel="noreferrer"
          className="btn-base mb-4 w-full border-nasa-blue text-center text-nasa-blue lg:mb-0 lg:w-auto"
        >
          {dictionary.button.go_to_apod}
        </Link>
      )}
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
