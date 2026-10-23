import { IApodApiClient, ApodRawPage } from "@/domain/shared/IApodApiClient"
import { Result, success, error } from "@/domain/shared/result"
import { getSiteConfig } from "@/helpers/get-site-config"
import {
  NotFoundError,
  InternalServerError,
  UnauthorizedServerError,
  InvalidDataError
} from "@/domain/shared/errors"
import { ApodRawResponse } from "@/domain/Apod/RawResponse/ApodRawResponse"
import { toLegacyDate } from "@/utils/legacy-date"

type ClientError = NotFoundError | InvalidDataError | InternalServerError | UnauthorizedServerError
type RequestOptions = RequestInit & { next?: { revalidate: number } }

export interface ApodApiClientOptions {
  attempts?: number
  retryDelayMs?: number
}

const MAX_PER_PAGE = 25
const RECENT_REVALIDATE_SECONDS = 60 * 60
const ARCHIVE_REVALIDATE_SECONDS = 60 * 60 * 24 * 7
const RECENT_WINDOW_DAYS = 2
const DAY_MS = 24 * 60 * 60 * 1000

function parseRawApod(value: unknown): ApodRawResponse | null {
  if (typeof value !== "object" || value === null) {
    return null
  }

  const candidate = value as Record<string, unknown>
  const isValid =
    typeof candidate.post_id === "number" &&
    typeof candidate.date === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.permalink === "string" &&
    typeof candidate.explanation === "string" &&
    (candidate.media_type === "image" || candidate.media_type === "video")

  return isValid ? (candidate as unknown as ApodRawResponse) : null
}

function isRetryable(status: number): boolean {
  return status === 429 || status >= 500
}

export class ApodApiClient implements IApodApiClient {

  private readonly baseUrl: string
  private readonly attempts: number
  private readonly retryDelayMs: number

  constructor(options: ApodApiClientOptions = {}) {
    const config = getSiteConfig()
    this.baseUrl = (config.nasa_config.api_url ?? "").replace(/\/+$/, "")
    this.attempts = options.attempts ?? 3
    this.retryDelayMs = options.retryDelayMs ?? 300
  }

  async getByDate(date: string): Promise<Result<NotFoundError | InvalidDataError | InternalServerError | UnauthorizedServerError, ApodRawResponse>> {
    const legacyDate = toLegacyDate(date)

    if (!legacyDate) {
      return error(new InvalidDataError("date"))
    }

    const response = await this.request(`${this.baseUrl}/${legacyDate}`, this.revalidateFor(date))

    if (response.isError()) {
      return error(response.value instanceof NotFoundError ? new NotFoundError(date) : response.value)
    }

    const raw = parseRawApod(response.value.data)

    return raw ? success(raw) : error(new InvalidDataError("response"))
  }

  async getList(start_date: string | undefined, end_date: string | undefined, page: number, per_page: number): Promise<Result<InvalidDataError | InternalServerError | UnauthorizedServerError, ApodRawPage>> {
    if (!Number.isInteger(page) || page < 1) {
      return error(new InvalidDataError("page"))
    }

    if (!Number.isInteger(per_page) || per_page < 1 || per_page > MAX_PER_PAGE) {
      return error(new InvalidDataError("per_page"))
    }

    const url = new URL(`${this.baseUrl}/`)
    url.searchParams.set("page", String(page))
    url.searchParams.set("per_page", String(per_page))

    if (start_date || end_date) {
      const from = start_date ? toLegacyDate(start_date) : null
      const to = end_date ? toLegacyDate(end_date) : null

      if (!from || !to || start_date > end_date) {
        return error(new InvalidDataError("date_range"))
      }

      url.searchParams.set("date_from", from)
      url.searchParams.set("date_to", to)
    }

    const response = await this.request(url.toString(), RECENT_REVALIDATE_SECONDS)

    if (response.isError()) {
      return error(response.value instanceof NotFoundError ? new InternalServerError(url.toString()) : response.value)
    }

    const body = response.value.data

    if (!Array.isArray(body)) {
      return error(new InvalidDataError("response"))
    }

    const items: ApodRawResponse[] = []

    for (const entry of body) {
      const raw = parseRawApod(entry)

      if (!raw) {
        return error(new InvalidDataError("response"))
      }

      items.push(raw)
    }

    const headers = response.value.headers

    return success({
      items,
      total: Number(headers.get("x-wp-total") ?? items.length),
      total_pages: Number(headers.get("x-wp-totalpages") ?? 1),
    })
  }

  private async request(url: string, revalidate: number): Promise<Result<ClientError, { data: unknown; headers: Headers }>> {
    for (let attempt = 1; attempt <= this.attempts; attempt++) {
      const canRetry = attempt < this.attempts

      try {
        const options: RequestOptions = {
          method: "GET",
          redirect: "follow",
          next: { revalidate },
        }

        const response = await fetch(url, options)

        if (response.status === 200) {
          return success({ data: await response.json(), headers: response.headers })
        }

        if (response.status === 400) {
          return error(new InvalidDataError("request"))
        }

        if (response.status === 404) {
          return error(new NotFoundError(url))
        }

        if (response.status === 401 || response.status === 403) {
          return error(new UnauthorizedServerError(url))
        }

        if (isRetryable(response.status) && canRetry) {
          await this.wait(attempt)
          continue
        }

        return error(new InternalServerError(url))
      } catch (cause) {
        if (canRetry) {
          await this.wait(attempt)
          continue
        }

        return error(new InternalServerError(cause instanceof Error ? cause.message : url))
      }
    }

    return error(new InternalServerError(url))
  }

  private wait(attempt: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.retryDelayMs * attempt))
  }

  private revalidateFor(date: string): number {
    const cutoff = new Date(Date.now() - RECENT_WINDOW_DAYS * DAY_MS).toISOString().slice(0, 10)
    return date >= cutoff ? RECENT_REVALIDATE_SECONDS : ARCHIVE_REVALIDATE_SECONDS
  }
}
