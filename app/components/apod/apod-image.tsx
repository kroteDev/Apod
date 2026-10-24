"use client"

import { useCallback, type ReactNode } from "react"
import { ApodSkeleton } from "@/app/components/apod/skeleton"
import { useMediaStatus } from "@/app/components/apod/use-media-status"

interface ApodImageProps {
  src: string
  alt: string
  className?: string
  frameClassName?: string
  loadingClassName?: string
  fallback: ReactNode
}

export function ApodImage({
  src,
  alt,
  className = "",
  frameClassName = "",
  loadingClassName = "",
  fallback,
}: ApodImageProps) {
  const [status, setStatus] = useMediaStatus(src)

  const markIfCached = useCallback(
    (image: HTMLImageElement | null) => {
      if (image?.complete) {
        setStatus(image.naturalWidth > 0 ? "loaded" : "error")
      }
    },
    [setStatus],
  )

  if (status === "error") {
    return <>{fallback}</>
  }

  const loading = status === "loading"

  return (
    <div className={`relative overflow-hidden ${frameClassName} ${loading ? loadingClassName : ""}`}>
      {loading && <ApodSkeleton className="absolute inset-0 h-full w-full" />}
      {/* eslint-disable-next-line @next/next/no-img-element -- the API gives no dimensions, so next/image cannot reserve space */}
      <img
        ref={markIfCached}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
        className={`${className} transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"}`}
      />
    </div>
  )
}
