import { APOD_CARD_CLASS, APOD_DETAIL_CLASS } from "@/app/components/apod/classes"

export function ApodSkeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded bg-grey-light/20 ${className}`} />
}

export function ApodDetailSkeleton() {
  return (
    <article aria-hidden="true" className={APOD_DETAIL_CLASS}>
      <ApodSkeleton className="mb-14 min-h-72 h-[50vh] w-full" />
      <ApodSkeleton className="mb-6 h-10 w-3/4" />
      <div className="mb-8 space-y-3">
        <ApodSkeleton className="h-4 w-full" />
        <ApodSkeleton className="h-4 w-full" />
        <ApodSkeleton className="h-4 w-2/3" />
      </div>
      <ApodSkeleton className="mb-14 h-4 w-1/2" />
      <div className="flex flex-wrap gap-x-2">
        <ApodSkeleton className="mb-4 h-12 w-full lg:mb-0 lg:w-40" />
        <ApodSkeleton className="mb-4 h-12 w-full lg:mb-0 lg:w-40" />
      </div>
    </article>
  )
}

export function ApodCardSkeleton() {
  return (
    <article aria-hidden="true" className={APOD_CARD_CLASS}>
      <div className="image-wrapper block h-72 w-full overflow-hidden md:h-auto md:w-3/6">
        <ApodSkeleton className="h-full w-full rounded-none" />
      </div>
      <div className="info w-full px-4 pt-12 pb-12 md:w-3/6 lg:px-12">
        <ApodSkeleton className="mb-6 h-8 w-3/4" />
        <div className="mb-8 space-y-3">
          <ApodSkeleton className="h-4 w-full" />
          <ApodSkeleton className="h-4 w-full" />
          <ApodSkeleton className="h-4 w-1/2" />
        </div>
        <ApodSkeleton className="mb-4 h-12 w-40" />
      </div>
    </article>
  )
}
