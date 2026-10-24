import type { ApodDto } from "@/domain/Apod/Dto/ApodDto"
import type { Dictionary } from "@/helpers/internationalization/get-dictionary"
import { ApodMediaUnavailable } from "@/app/components/apod/apod-media-unavailable"

interface ApodVideoProps {
  apod: ApodDto
  dictionary: Dictionary
}

export function ApodVideo({ apod, dictionary }: ApodVideoProps) {
  if (!apod.media_url) {
    return <ApodMediaUnavailable dictionary={dictionary} />
  }

  if (apod.video_type === "video") {
    return (
      <video
        controls
        preload="metadata"
        poster={apod.thumbnail_url ?? undefined}
        title={apod.title}
        className="mx-auto mb-14 block h-auto max-h-[80vh] w-auto max-w-full"
      >
        <source src={apod.media_url} type="video/mp4" />
      </video>
    )
  }

  return (
    <div className="mx-auto mb-14 aspect-video w-full">
      <iframe
        src={apod.media_url}
        title={apod.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  )
}
