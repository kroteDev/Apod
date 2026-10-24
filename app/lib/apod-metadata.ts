import type { Metadata } from "next"
import type { ApodDto } from "@/domain/Apod/Dto/ApodDto"

export const SITE_TITLE = "KröteDev APOD"

export function buildApodMetadata(apod: ApodDto | null): Metadata {
  if (!apod) {
    return { title: SITE_TITLE }
  }

  const title = `${SITE_TITLE} - ${apod.title}`
  const image = apod.media_type === "image" ? apod.media_url : apod.thumbnail_url

  return {
    title,
    description: apod.explanation,
    openGraph: {
      title,
      description: apod.explanation,
      images: image ?? undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: apod.explanation,
      images: image ?? undefined,
    },
  }
}
