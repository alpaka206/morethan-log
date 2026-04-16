import { useQuery } from "@tanstack/react-query"
import mermaid from "mermaid"
import { useEffect, useRef } from "react"
import { queryKey } from "src/constants/queryKey"

/**
 *  Wait for mermaid to be defined in the dom
 *  Additionally, verify that the HTML CollectionOf has an array value.
 */
const waitForMermaid = (interval = 100, timeout = 5000) => {
  return new Promise<HTMLCollectionOf<Element> | null>((resolve) => {
    const startTime = Date.now()
    const elements: HTMLCollectionOf<Element> =
      document.getElementsByClassName("language-mermaid")

    const checkMerMaidCode = () => {
      if (mermaid.render !== undefined && elements.length > 0) {
        resolve(elements)
      } else if (Date.now() - startTime >= timeout) {
        resolve(null)
      } else {
        setTimeout(checkMerMaidCode, interval)
      }
    }
    checkMerMaidCode()
  })
}
const useMermaidEffect = (trigger?: string | null) => {
  const memoMermaid = useRef<Map<number, string>>(new Map())

  const { data, isFetched } = useQuery({
    queryKey: queryKey.scheme(),
    enabled: false,
  })

  useEffect(() => {
    if (!isFetched) return
    mermaid.initialize({
      startOnLoad: true,
      theme: (data as "dark" | "light") === "dark" ? "dark" : "default",
    })

    if (!document) return

    waitForMermaid()
      .then(async (elements) => {
        if (!elements?.length) return

        const promises = Array.from(elements)
          .filter((el) => el.tagName === "PRE")
          .map(async (element, i) => {
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
      })
  }, [data, isFetched, trigger])

  return
}

export default useMermaidEffect
