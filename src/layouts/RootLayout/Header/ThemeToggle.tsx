import styled from "@emotion/styled"
import React from "react"
import { Emoji } from "src/components/Emoji"
import useScheme from "src/hooks/useScheme"

type Props = {}

const ThemeToggle: React.FC<Props> = () => {
  const [scheme, setScheme] = useScheme()

  const handleClick = () => {
    setScheme(scheme === "light" ? "dark" : "light")
  }

  return (
    <StyledWrapper
      type="button"
      onClick={handleClick}
      aria-label={`Switch to ${scheme === "light" ? "dark" : "light"} mode`}
    >
      <Emoji>{scheme === "light" ? "☀️" : "🌙"}</Emoji>
    </StyledWrapper>
  )
}

export default ThemeToggle

const StyledWrapper = styled.button`
  cursor: pointer;
`
