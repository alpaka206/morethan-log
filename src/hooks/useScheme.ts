import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getCookie, setCookie } from "cookies-next"
import { useCallback, useEffect } from "react"
import { CONFIG } from "site.config"
import { queryKey } from "src/constants/queryKey"

type Scheme = "light" | "dark"
type SetScheme = (scheme: Scheme) => void

const defaultScheme: Scheme = CONFIG.blog.theme === "dark" ? "dark" : "light"

const useScheme = (): [Scheme, SetScheme] => {
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: queryKey.scheme(),
    enabled: false,
    initialData: defaultScheme,
  })

  const scheme = data === "light" ? "light" : "dark"

  const setScheme = useCallback(
    (scheme: Scheme) => {
      setCookie("scheme", scheme, { sameSite: "lax" })
      queryClient.setQueryData(queryKey.scheme(), scheme)
    },
    [queryClient]
  )

  useEffect(() => {
    const saved = getCookie("scheme")
    const initialScheme =
      saved === "light" || saved === "dark" ? saved : defaultScheme

    queryClient.setQueryData(queryKey.scheme(), initialScheme)
  }, [queryClient])

  return [scheme, setScheme]
}

export default useScheme
