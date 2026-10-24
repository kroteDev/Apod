import { ApodCardSkeleton, ApodDetailSkeleton, ApodSkeleton } from "@/app/components/apod/skeleton"

export default function Loading() {
  return (
    <section className="flex-1">
      <ApodDetailSkeleton />

      <section className="mx-auto w-full max-w-5xl px-4 md:px-8">
        <header className="my-28">
          <ApodSkeleton className="h-10 w-64 md:h-20 md:w-96" />
        </header>

        <ApodCardSkeleton />
        <ApodCardSkeleton />
      </section>
    </section>
  )
}
