import { RefObject, useEffect } from "react"

const PRISM_SELECTOR =
  'pre code[class*="language-"]:not(.language-mermaid), code[class*="language-"]:not(.language-mermaid)'

const loadPrism = (() => {
  let promise: Promise<{ highlightAllUnder: (element: ParentNode) => void }> | null =
    null

  return async () => {
    if (!promise) {
      promise = import("prismjs/prism").then(async (module) => {
        await Promise.all([
          import("prismjs/components/prism-markup-templating.js"),
          import("prismjs/components/prism-markup.js"),
          import("prismjs/components/prism-bash.js"),
          import("prismjs/components/prism-c.js"),
          import("prismjs/components/prism-cpp.js"),
          import("prismjs/components/prism-csharp.js"),
          import("prismjs/components/prism-docker.js"),
          import("prismjs/components/prism-java.js"),
          import("prismjs/components/prism-js-templates.js"),
          import("prismjs/components/prism-coffeescript.js"),
          import("prismjs/components/prism-diff.js"),
          import("prismjs/components/prism-git.js"),
          import("prismjs/components/prism-go.js"),
          import("prismjs/components/prism-kotlin.js"),
          import("prismjs/components/prism-graphql.js"),
          import("prismjs/components/prism-handlebars.js"),
          import("prismjs/components/prism-less.js"),
          import("prismjs/components/prism-makefile.js"),
          import("prismjs/components/prism-markdown.js"),
          import("prismjs/components/prism-objectivec.js"),
          import("prismjs/components/prism-ocaml.js"),
          import("prismjs/components/prism-python.js"),
          import("prismjs/components/prism-reason.js"),
          import("prismjs/components/prism-rust.js"),
          import("prismjs/components/prism-sass.js"),
          import("prismjs/components/prism-scss.js"),
          import("prismjs/components/prism-solidity.js"),
          import("prismjs/components/prism-sql.js"),
          import("prismjs/components/prism-stylus.js"),
          import("prismjs/components/prism-swift.js"),
          import("prismjs/components/prism-wasm.js"),
          import("prismjs/components/prism-yaml.js"),
        ])

        return module.default
      })
    }

    return promise
  }
})()

const usePrismEffect = (
  containerRef: RefObject<HTMLElement>,
  trigger?: string | null
) => {
  useEffect(() => {
    if (!trigger) {
      return
    }

    const container = containerRef.current
    if (!container || !container.querySelector(PRISM_SELECTOR)) {
      return
    }

    let cancelled = false

    void loadPrism().then((prism) => {
      if (cancelled) {
        return
      }

      prism.highlightAllUnder(container)
    })

    return () => {
      cancelled = true
    }
  }, [containerRef, trigger])
}

export default usePrismEffect
