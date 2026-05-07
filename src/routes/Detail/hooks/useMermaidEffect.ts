import { useQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import { queryKey } from "src/constants/queryKey"

const useMermaidEffect = (trigger?: string | null) => {
  const memoMermaid = useRef<Map<number, string>>(new Map())

  const { data, isFetched } = useQuery({
    queryKey: queryKey.scheme(),
    enabled: false,
  })

  useEffect(() => {
    if (!isFetched) return

    const elements = Array.from(
      document.getElementsByClassName("language-mermaid")
    ).filter((el) => el.tagName === "PRE")

    if (elements.length === 0) return

    let cancelled = false

    const renderMermaid = async () => {
      const { default: mermaid } = await import("mermaid")

      if (cancelled) return

      mermaid.initialize({
        startOnLoad: true,
        theme: (data as "dark" | "light") === "dark" ? "dark" : "default",
      })

      const promises = elements.map(async (element, i) => {
        const cached = memoMermaid.current.get(i)

        if (cached !== undefined) {
          const svg = await mermaid
            .render("mermaid" + i, cached)
            .then((res) => res.svg)

          element.animate(
            [
              { easing: "ease-in", opacity: 0 },
              { easing: "ease-out", opacity: 1 },
            ],
            { duration: 300, fill: "both" }
          )
          element.innerHTML = svg
          return
        }

        const source = element.textContent ?? ""
        const svg = await mermaid
          .render("mermaid" + i, source)
          .then((res) => res.svg)

        memoMermaid.current.set(i, source)
        element.innerHTML = svg
      })
      await Promise.all(promises)
    }

    void renderMermaid()

    return () => {
      cancelled = true
    }
  }, [data, isFetched, trigger])

  return
}

export default useMermaidEffect
