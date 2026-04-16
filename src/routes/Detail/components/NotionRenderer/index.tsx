import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import useScheme from "src/hooks/useScheme"
import useMermaidEffect from "src/routes/Detail/hooks/useMermaidEffect"

// core styles shared by all of react-notion-x (required)
import "react-notion-x/src/styles.css"

// used for code syntax highlighting (optional)
import "prismjs/themes/prism-tomorrow.css"

// used for rendering equations (optional)

import "katex/dist/katex.min.css"
import { FC, useEffect, useState } from "react"
import styled from "@emotion/styled"
import useRecordMapQuery from "src/hooks/useRecordMapQuery"
import { joinUrl } from "src/libs/utils"

const _NotionRenderer = dynamic(
  () => import("react-notion-x").then((m) => m.NotionRenderer),
  { ssr: false }
)

const Code = dynamic(() =>
  import("react-notion-x/build/third-party/code").then(async (m) => m.Code)
)

const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then(
    (m) => m.Collection
  )
)
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
)
const Pdf = dynamic(
  () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
  {
    ssr: false,
  }
)
const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  {
    ssr: false,
  }
)

type Props = {
  pageId: string
  pageLinkMap?: Record<string, string>
}

const NotionRenderer: FC<Props> = ({ pageId, pageLinkMap = {} }) => {
  const [scheme] = useScheme()
  const {
    data: recordMap,
    isLoading,
    isError,
    refetch,
  } = useRecordMapQuery(pageId)
  const [showLoadingMessage, setShowLoadingMessage] = useState(false)

  useMermaidEffect(recordMap ? pageId : null)

  useEffect(() => {
    if (!isLoading) {
      setShowLoadingMessage(false)
      return
    }

    const timeoutId = window.setTimeout(() => {
      setShowLoadingMessage(true)
    }, 180)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [isLoading])

  const mapPageUrl = (id?: string) => {
    if (!id) {
      return "#"
    }

    const slug = pageLinkMap[id] || pageLinkMap[id.replace(/-/g, "")]
    if (slug) {
      return joinUrl("/", slug)
    }

    return "#"
  }

  if (isError) {
    return (
      <StatusBox>
        <p>본문을 불러오지 못했습니다.</p>
        <button type="button" onClick={() => void refetch()}>
          다시 시도
        </button>
      </StatusBox>
    )
  }

  if (isLoading || !recordMap) {
    return (
      <StatusBox data-visible={showLoadingMessage}>
        <p>본문을 불러오는 중입니다.</p>
      </StatusBox>
    )
  }

  return (
    <StyledWrapper>
      <_NotionRenderer
        darkMode={scheme === "dark"}
        recordMap={recordMap}
        components={{
          Code,
          Collection,
          Equation,
          Modal,
          Pdf,
          nextImage: Image,
          nextLink: Link,
        }}
        mapPageUrl={mapPageUrl}
      />
    </StyledWrapper>
  )
}

export default NotionRenderer

const StyledWrapper = styled.div`
  /* // TODO: why render? */
  .notion-collection-page-properties {
    display: none !important;
  }
  .notion-page {
    padding: 0;
  }
  .notion-list {
    width: 100%;
  }
`

const StatusBox = styled.div`
  display: grid;
  gap: 0.75rem;
  justify-items: start;
  padding: 1rem 0;

  > p {
    margin: 0;
    color: ${({ theme }) => theme.colors.gray10};
  }

  > button {
    padding: 0.625rem 0.875rem;
    border-radius: 0.75rem;
    background-color: ${({ theme }) => theme.colors.gray5};
    color: ${({ theme }) => theme.colors.gray12};
    font-weight: 600;
  }

  &[data-visible="false"] {
    min-height: 1.5rem;
    visibility: hidden;
  }
`
