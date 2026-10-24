"use client"

import { useCallback } from "react"
import type { ApodDto } from "@/domain/Apod/Dto/ApodDto"
import type { Dictionary } from "@/helpers/internationalization/get-dictionary"
import { ApodMediaUnavailable } from "@/app/components/apod/apod-media-unavailable"
import { ApodSkeleton } from "@/app/components/apod/skeleton"
import { useMediaStatus } from "@/app/components/apod/use-media-status"

interface ApodVideoProps {
  apod: ApodDto
  dictionary: Dictionary
}

export function ApodVideo({ apod, dictionary }: ApodVideoProps) {
  const [status, setStatus] = useMediaStatus(apod.media_url)

  const markIfCached = useCallback(
    (video: HTMLVideoElement | null) => {
      if (video?.error) {
        setStatus("error")
      } else if (video && video.readyState >= 1) {
        setStatus("loaded")
      }
    },
    [setStatus],
  )

  if (!apod.media_url || status === "error") {
    return <ApodMediaUnavailable dictionary={dictionary} />
  }

  const loading = status === "loading"
  const fade = `transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"}`

  if (apod.video_type === "video") {
    return (
      <div className={`relative mx-auto mb-14 w-full ${loading ? "min-h-[40vh]" : ""}`}>
        {loading && <ApodSkeleton className="absolute inset-0 h-full w-full" />}
        <video
          ref={markIfCached}
          controls
          preload="metadata"
          poster={apod.thumbnail_url ?? undefined}
          title={apod.title}
          onLoadedMetadata={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={`mx-auto block h-auto max-h-[80vh] w-auto max-w-full ${fade}`}
        >
          <source src={apod.media_url} type="video/mp4" />
        </video>
      </div>
    )
  }

  return (
    <div className="relative mx-auto mb-14 aspect-video w-full">
      {loading && <ApodSkeleton className="absolute inset-0 h-full w-full" />}
      <iframe
        src={apod.media_url}
        title={apod.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={() => setStatus("loaded")}
        className={`h-full w-full ${fade}`}
      />
    </div>
  )
}
