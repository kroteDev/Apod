import { useCallback, useState } from "react"

export type MediaStatus = "loading" | "loaded" | "error"

export function useMediaStatus(src: string | null): [MediaStatus, (next: MediaStatus) => void] {
  const [state, setState] = useState<{ src: string | null; status: MediaStatus }>({ src, status: "loading" })

  const setStatus = useCallback(
    (next: MediaStatus) => {
      setState((prev) => (prev.src === src && prev.status === next ? prev : { src, status: next }))
    },
    [src],
  )

  const status = state.src === src ? state.status : "loading"

  return [status, setStatus]
}
