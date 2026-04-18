import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { queryKey } from "src/constants/queryKey"

type Options = {
  pathKey: string
  slug?: string
}

const createSessionStorageKey = (pathKey: string) => `tracked-view:${pathKey}`

const useTrackPageView = ({ pathKey, slug }: Options) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const storageKey = createSessionStorageKey(pathKey)

    if (window.sessionStorage.getItem(storageKey)) {
      return
    }

    window.sessionStorage.setItem(storageKey, "1")

    void fetch("/api/stats/view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to track page view")
        }

        return response.json()
      })
      .then(() => {
        void queryClient.invalidateQueries(queryKey.statsSummary())

        if (slug) {
          void queryClient.invalidateQueries(queryKey.statsSummary(slug))
        }
      })
      .catch(() => {
        window.sessionStorage.removeItem(storageKey)
      })
  }, [pathKey, queryClient, slug])
}

export default useTrackPageView
