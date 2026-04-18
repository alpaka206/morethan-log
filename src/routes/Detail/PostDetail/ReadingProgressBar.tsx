import styled from "@emotion/styled"
import React, { useEffect, useState } from "react"
import { HEADER_HEIGHT } from "src/constants/layout"

const ReadingProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const root = document.documentElement
      const totalHeight = root.scrollHeight - root.clientHeight

      setProgress(totalHeight > 0 ? (root.scrollTop / totalHeight) * 100 : 0)
    }

    updateProgress()
    window.addEventListener("scroll", updateProgress, { passive: true })
    window.addEventListener("resize", updateProgress)

    return () => {
      window.removeEventListener("scroll", updateProgress)
      window.removeEventListener("resize", updateProgress)
    }
  }, [])

  return (
    <StyledWrapper aria-hidden="true">
      <div style={{ width: `${Math.min(progress, 100)}%` }} />
    </StyledWrapper>
  )
}

export default ReadingProgressBar

const StyledWrapper = styled.div`
  position: fixed;
  top: ${HEADER_HEIGHT}px;
  left: 0;
  z-index: 20;
  width: 100%;
  height: 3px;
  background-color: ${({ theme }) => theme.colors.gray4};

  > div {
    height: 100%;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.gray12} 0%,
      ${({ theme }) => theme.colors.gray9} 100%
    );
    transition: width 120ms ease-out;
  }
`
